import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { AuthResponseData, User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  // user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;


  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

  signUp(email: string, password: string ) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
          catchError(this.handleError),
          tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
          })
      )
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    );
  }

  autoLogin() {
    // @ts-ignore
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate)}))
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logOut() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout())
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration)
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    // const user = new User(email, userId, token, expirationDate);
    this.autoLogout(expiresIn * 1000);
    // this.user.next(user);
    const user = new User(email, userId, token, expirationDate)
    this.store.dispatch(new AuthActions.Login({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate
    }))
    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage )
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password';
        break;
    }
    return throwError(errorMessage)
  }
}

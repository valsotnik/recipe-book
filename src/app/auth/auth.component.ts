import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AuthResponseData } from "./user.model";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string | null = '';
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    if(!this.form.valid) {
      return;
    }
    const { email, password } = this.form.value;
    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;

    this.isLoginMode ? authObservable = this.authService.logIn(email, password) :
                       authObservable = this.authService.signUp(email, password);

    authObservable.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['./recipes'])
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    )
    this.form.reset();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError() {
    this.error = null;
  }
}

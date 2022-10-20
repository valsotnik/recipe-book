import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub!: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
    this.dataStorageService.storeIngredients();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
    this.dataStorageService.fetchIngredients().subscribe();
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}

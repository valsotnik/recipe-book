import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private slService: ShoppingListService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipes-book-6087b-default-rtdb.firebaseio.com//recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  storeIngredients() {
    const ingredients = this.slService.getIngredients();
    this.http
      .put(
        'https://recipes-book-6087b-default-rtdb.firebaseio.com//ingredients.json',
        ingredients
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
          'https://recipes-book-6087b-default-rtdb.firebaseio.com//recipes.json')
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    )
  }

  fetchIngredients() {
    return this.http
      .get<Ingredient[]>(
        'https://recipes-book-6087b-default-rtdb.firebaseio.com//ingredients.json')
      .pipe(tap(ingredients => {
          this.slService.setIngredients(ingredients);
        })
      )
  }
}

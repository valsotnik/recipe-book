import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from "@ngrx/store";
import * as ShoppingListActions from './../store/shopping-list.actions'
import * as fromShoppingList from "../store/shopping-list.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  editMode: boolean = false;
  // editedItemIndex!: number;
  editedItem!: Ingredient;
  form!: FormGroup;

  constructor(private slService: ShoppingListService, private fb: FormBuilder, private store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.initForm();
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        // @ts-ignore
        this.editedItem = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    })
    // this.subscription = this.slService.startedEditing
    //   .subscribe(
    //     (index: number) => {
    //       this.editedItemIndex = index;
    //       this.editMode = true;
    //       this.editedItem = this.slService.getIngredient(index);
    //       this.form.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       })
    //     }
    //   );
  }

  initForm() {
    this.form = this.fb.group({
      name: [null, Validators.required],
      amount: [null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]
      ]
    })
  }

  onSubmit() {
    const value = this.form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.editMode ?
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient) :
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient)) :
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredients())
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}

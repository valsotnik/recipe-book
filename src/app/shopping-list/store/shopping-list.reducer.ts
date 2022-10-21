import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface ShoppingListState{
  ingredients: Ingredient[];
}
const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Tomatoes', 10),
    new Ingredient('Potato', 5),
    new Ingredient('Chicken', 1),
  ]
};

export function shoppingListReducer(state:ShoppingListState = initialState, action: ShoppingListActions.AddIngredient): ShoppingListState {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    default:
      return state;
  }
}

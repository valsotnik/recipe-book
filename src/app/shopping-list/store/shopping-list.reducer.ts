import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";
import { StartEdit } from "./shopping-list.actions";

export interface AppState {
  shoppingList: ShoppingListState;
};

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null,
  editedIngredientIndex: number
}

const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Tomatoes', 10),
    new Ingredient('Potato', 5),
    new Ingredient('Chicken', 1),
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: ShoppingListState = initialState, action: ShoppingListActions.ShoppingListActions): ShoppingListState {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      }
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((el,index) => index !== state.editedIngredientIndex),
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredient: {...state.ingredients[action.payload]},
        editedIngredientIndex: action.payload
      }
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    default:
      return state;
  }
}

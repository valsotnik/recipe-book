import { shoppingListReducer, AppState } from './shopping-list.reducer';
import { ActionReducerMap } from '@ngrx/store';

export const rootReducer = {};

export const reducers: ActionReducerMap<AppState, any> = {
  shoppingList: shoppingListReducer
};

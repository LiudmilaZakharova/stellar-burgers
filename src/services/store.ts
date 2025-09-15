import { combineReducers, configureStore } from '@reduxjs/toolkit';
import burgerConstructorReducer from './slices/constructor';
import burgerIngredientReducer from './slices/ingredients';
import feedReducer from './slices/feed';
import userReducer from './slices/user';
import profileReducer from './slices/orders';
import orderReducer from './slices/order';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  burgerIngredients: burgerIngredientReducer,
  feed: feedReducer,
  user: userReducer,
  orders: profileReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

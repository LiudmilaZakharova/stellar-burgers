import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

type TBurgerIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError['message'] | null;
};

export const initialState: TBurgerIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const burgerIngredientSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectLoading: (state) => state.isLoading,
    selectIngredients: (state) => state.ingredients
  }
});

export const { selectLoading, selectIngredients } =
  burgerIngredientSlice.selectors;

export default burgerIngredientSlice.reducer;

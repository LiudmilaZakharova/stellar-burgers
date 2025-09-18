import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TBuilderState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBuilderState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } } as {
          payload: TConstructorIngredient;
        };
      }
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const index = state.ingredients.findIndex(
        (i) => i.id === action.payload.id
      );
      if (index === -1) return;

      const { direction } = action.payload;
      let newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= state.ingredients.length) return;

      const temp = state.ingredients[newIndex];
      state.ingredients[newIndex] = state.ingredients[index];
      state.ingredients[index] = temp;
    },

    resetBurgerConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    }
  },
  selectors: {
    selectConstructorState: (sliceState) => sliceState
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  resetBurgerConstructor,
  setIngredients
} = constructorSlice.actions;

export const { selectConstructorState } = constructorSlice.selectors;

export default constructorSlice.reducer;

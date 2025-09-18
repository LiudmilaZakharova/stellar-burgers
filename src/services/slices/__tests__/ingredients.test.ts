import ingredientsReducer, {
  fetchIngredients,
  initialState,
  selectIngredients,
  selectLoading
} from '../ingredients';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];

describe('ingredient slice test', () => {
  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('обработка fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('обработка fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка ответа';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});

describe('тестирование селекторов', () => {
  it('selectLoading возвращает правильное значение isLoading', () => {
    const newState = {
      ingredients: mockIngredients,
      isLoading: true,
      error: undefined
    };
    expect(selectLoading({ burgerIngredients: newState })).toBe(true);
  });

  it('selectIngredients возвращает корректные ингредиенты', () => {
    const newState = {
      ingredients: mockIngredients,
      isLoading: false,
      error: undefined
    };
    expect(selectIngredients({ burgerIngredients: newState })).toEqual(
      mockIngredients
    );
  });
});

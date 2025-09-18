import { rootReducer, store } from '../../store';

describe('rootReducer', () => {
  const initialState = rootReducer(undefined, { type: '@@INIT' });

  it('возвращает состояние по умолчанию при передаче пустого действия, содержит все необходимые слайсы', () => {
    expect(initialState).toEqual(store.getState());

    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('burgerIngredients');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('order');
  });
});

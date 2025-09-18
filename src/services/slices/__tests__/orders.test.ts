
import ordersReducer, { fetchProfileOrders, initialState, selectProfileOrders } from "../orders"

const mockOrders = [
    {
  _id: "68ca9f05673086001ba88961",
  ingredients: [
    "643d69a5c3f7b9001cfa093d",
    "643d69a5c3f7b9001cfa093e",
    "643d69a5c3f7b9001cfa0949",
    "643d69a5c3f7b9001cfa0945",
    "643d69a5c3f7b9001cfa093d"
  ],
  status: "done",
  name: "Экзо-плантаго флюоресцентный люминесцентный антарианский бургер",
  createdAt: "2025-09-17T11:44:05.025Z",
  updatedAt: "2025-09-17T11:44:06.317Z",
  number: 88906
},
{
  _id: "68ca9b96673086001ba88959",
  "ingredients": [
    "643d69a5c3f7b9001cfa093c",
    "643d69a5c3f7b9001cfa093f",
    "643d69a5c3f7b9001cfa0942",
    "643d69a5c3f7b9001cfa093c"
  ],
  status: "done",
  name: "Краторный бессмертный spicy бургер",
  createdAt: "2025-09-17T11:29:26.493Z",
  updatedAt: "2025-09-17T11:29:27.593Z",
  number: 88904
}
];

describe('orders slice test', () => {
  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(ordersReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  })

  it('обработка fetchProfileOrders.pending', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = ordersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  })

  it('обработка fetchProfileOrders.fulfilled', () => {
    const action = { type: fetchProfileOrders.fulfilled.type, payload: mockOrders };
    const state = ordersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  })

  it('обработка fetchProfileOrders.rejected', () => {
    const errorMessage = 'Ошибка ответа';
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: undefined,
      error: { message: errorMessage },
    };
    const state = ordersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
});
});


describe('тестирование селекторов', () => {
  const newState = {
    orders: mockOrders,
    isLoading: false,
    error: undefined
  };

  it('selectOrders возвращает заказы', () => {
    expect(selectProfileOrders({orders: newState})).toEqual(mockOrders);
  });
})

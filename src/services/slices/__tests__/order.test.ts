import orderReducer, {
  clearOrderModalData,
  createOrderBurger,
  getOrderByNumber,
  initialState,
  selectOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../order';

const mockOrder = {
  order: {
    _id: '68cbb3cb673086001ba88b4d',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Краторный spicy бургер',
    createdAt: '2025-09-18T07:24:59.430Z',
    updatedAt: '2025-09-18T07:25:00.538Z',
    number: 88990
  },
  success: false
};

const mockOrders = {
  success: false,
  orders: [
    {
      _id: '68cbb3cb673086001ba88b4d',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный spicy бургер',
      createdAt: '2025-09-18T07:24:59.430Z',
      updatedAt: '2025-09-18T07:25:00.538Z',
      number: 88990
    },
    {
      _id: '68cb8cc5673086001ba88b22',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0947',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0944',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный традиционный-галактический фалленианский люминесцентный бургер',
      createdAt: '2025-09-18T04:38:29.269Z',
      updatedAt: '2025-09-18T04:38:30.510Z',
      number: 88981
    }
  ]
};

describe('order slice test', () => {
  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('обработка createOrderBurger.pending', () => {
    const action = { type: createOrderBurger.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.orderRequest).toBe(true);
  });

  it('обработка createOrderBurger.fulfilled', () => {
    const action = {
      type: createOrderBurger.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);
    expect(state.orderData).toEqual(mockOrder.order);
    expect(state.orderModalData).toEqual(mockOrder.order);
    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(false);
  });

  it('обработка createOrderBurger.rejected', () => {
    const errorMessage = 'Ошибка создания заказа';
    const action = {
      type: createOrderBurger.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('обработка getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.orderRequest).toBe(false);
  });

  it('обработка getOrderByNumber.fulfilled', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: mockOrders
    };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(mockOrders.success);
    expect(state.orderByNumber).toEqual(mockOrders.orders[0]);
  });

  it('обработка getOrderByNumber.rejected', () => {
    const errorMessage = 'Ошибка';
    const action = {
      type: getOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('обработка clearOrderModalData', () => {
    const stateWithModalData = {
      ...initialState,
      orderModalData: mockOrder.order
    };
    const state = orderReducer(stateWithModalData, clearOrderModalData());
    expect(state.orderModalData).toBeNull();
  });
});

describe('тестирование селекторов', () => {
  const newState = {
    orderData: mockOrder.order,
    orderRequest: true,
    isLoading: false,
    error: undefined,
    orderModalData: mockOrder.order,
    orderByNumber: mockOrders.orders[0]
  };

  it('selectOrder should return orderData', () => {
    expect(selectOrder({ order: newState })).toEqual(mockOrder.order);
  });

  it('selectOrderModalData should return orderModalData', () => {
    expect(selectOrderModalData({ order: newState })).toEqual(mockOrder.order);
  });

  it('selectOrderRequest should return orderRequest', () => {
    expect(selectOrderRequest({ order: newState })).toBe(true);
  });
});

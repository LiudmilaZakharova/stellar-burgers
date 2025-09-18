import feedReducer, {
  fetchFeeds,
  initialState,
  selectErrors,
  selectFeed,
  selectLoading,
  selectOrders
} from '../feed';

const mockFeedData = {
  orders: [
    {
      _id: '68ca9f05673086001ba88961',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Экзо-плантаго флюоресцентный люминесцентный антарианский бургер',
      createdAt: '2025-09-17T11:44:05.025Z',
      updatedAt: '2025-09-17T11:44:06.317Z',
      number: 88906
    },
    {
      _id: '68ca9b96673086001ba88959',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный бессмертный spicy бургер',
      createdAt: '2025-09-17T11:29:26.493Z',
      updatedAt: '2025-09-17T11:29:27.593Z',
      number: 88904
    }
  ],
  total: 20,
  totalToday: 2
};

describe('feed slice test', () => {
  it('должен вернуть состояние по умолчанию при передаче пустого действия', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('обработка fetchFeeds.pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('обработка fetchFeeds.fulfilled', () => {
    const action = { type: fetchFeeds.fulfilled.type, payload: mockFeedData };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.feed.total).toBe(mockFeedData.total);
    expect(state.feed.totalToday).toBe(mockFeedData.totalToday);
    expect(state.error).toBeUndefined();
  });

  it('обработка fetchFeeds.rejected', () => {
    const errorMessage = 'Ошибка ответа';
    const action = {
      type: fetchFeeds.rejected.type,
      payload: undefined,
      error: { message: errorMessage }
    };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([]);
    expect(state.feed.total).toBe(0);
    expect(state.feed.totalToday).toBe(0);
    expect(state.error).toBe(errorMessage);
  });
});

describe('тестирование селекторов', () => {
  const newState = {
    orders: mockFeedData.orders,
    feed: { total: mockFeedData.total, totalToday: mockFeedData.totalToday },
    isLoading: false,
    error: undefined
  };

  it('selectOrders возвращает заказы', () => {
    expect(selectOrders({ feed: newState })).toEqual(mockFeedData.orders);
  });

  it('selectFeed возвращает количество заказов', () => {
    expect(selectFeed({ feed: newState })).toEqual({
      total: mockFeedData.total,
      totalToday: mockFeedData.totalToday
    });
  });

  it('selectLoading возвращает правильное состояние isLoading', () => {
    expect(selectLoading({ feed: newState })).toBe(false);
  });

  it('selectErrors возвращает error', () => {
    expect(selectErrors({ feed: newState })).toBeUndefined();
  });
});

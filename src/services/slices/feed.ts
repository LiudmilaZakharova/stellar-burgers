import { getFeedsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

type TFeedsState = {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | undefined;
};

export const initialState: TFeedsState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: undefined
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.orders = [];
        state.feed.total = 0;
        state.feed.totalToday = 0;
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed,
    selectLoading: (state) => state.isLoading,
    selectErrors: (state) => state.error
  }
});

export const { selectOrders, selectFeed, selectLoading, selectErrors } =
  feedSlice.selectors;

export default feedSlice.reducer;

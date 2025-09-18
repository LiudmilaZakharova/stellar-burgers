import { getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | undefined;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: undefined
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectProfileOrders: (state) => state.orders
  }
});

export const { selectProfileOrders } = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;

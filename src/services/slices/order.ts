import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TOrderState = {
  orderData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | undefined;
  orderModalData: TOrder | null;
  orderByNumber?: TOrder | null;
};

export const initialState: TOrderState = {
  orderData: null,
  orderRequest: false,
  isLoading: false,
  error: undefined,
  orderModalData: null,
  orderByNumber: null
};

export const createOrderBurger = createAsyncThunk(
  'order/createOrder',
  orderBurgerApi
);
export const getOrderByNumber = createAsyncThunk(
  'order/orderByNumber',
  getOrderByNumberApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderBurger.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(createOrderBurger.fulfilled, (state, action) => {
        state.orderData = action.payload.order;
        state.orderRequest = false;
        state.isLoading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = action.payload.success;
        state.isLoading = false;
        state.orderByNumber = action.payload.orders?.[0] || null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrder: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest
  }
});

export const { clearOrderModalData } = orderSlice.actions;

export const { selectOrder, selectOrderModalData, selectOrderRequest } =
  orderSlice.selectors;

export default orderSlice.reducer;

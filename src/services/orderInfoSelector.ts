import { RootState } from './store';

export const orderInfoSelector = (number: string) => (state: RootState) => {
  if (state.orders.orders.length) {
    const orderData = state.orders.orders.find(
      (item) => item.number === +number
    );
    if (orderData) return orderData;
  }

  if (state.feed.orders.length) {
    const orderData = state.feed.orders.find((item) => item.number === +number);
    if (orderData) return orderData;
  }

  if (state.order.orderByNumber?.number === +number) {
    return state.order.orderByNumber;
  }

  return null;
};

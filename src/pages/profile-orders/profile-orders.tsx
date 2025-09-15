import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders
} from '../../services/slices/orders';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectProfileOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};

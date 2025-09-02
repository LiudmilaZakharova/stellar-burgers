import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import {
  resetBurgerConstructor,
  selectConstructorState
} from '../../services/slices/constructor';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients';
import {
  clearOrderModalData,
  createOrderBurger,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/order';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/user';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorState);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const order = [
      constructorItems.bun?._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun?._id
    ];
    dispatch(createOrderBurger(order));

    if (!user) {
      navigate('/login');
      return;
    }
  };

  const closeOrderModal = () => {
    dispatch(resetBurgerConstructor());
    dispatch(clearOrderModalData());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { RootState, useDispatch, useSelector } from '../../services/store';
import { getFeeds, getOrders } from '../../services/order/order-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(
    (state: RootState) => state.order.history.orders
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getFeeds());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};

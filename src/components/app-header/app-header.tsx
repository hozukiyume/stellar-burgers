import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUserName } from '../../services/user/user-slice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName);
  return <AppHeaderUI userName={userName} />;
};

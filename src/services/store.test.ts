import { rootReducer } from './store';
import ingredientsSlice from './ingredients/ingredients-slice';
import orderSlice from './order/order-slice';
import userSlice from './user/user-slice';

describe('rootReducer', () => {
  it('Проверка инициализации rootReducer', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      order: orderSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userSlice(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});

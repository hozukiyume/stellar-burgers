import { expect, test, describe } from '@jest/globals';
import orderSlice, {
  initialState,
  orderBurger,
  getOrderByNumber,
  getFeeds,
  getOrders,
  addIngredient,
  createOrder,
  deleteIngredient,
  shiftIngredient,
  resetOrder
} from './order-slice';

const testIngredient = {
  _id: '1',
  name: 'Ингредиент',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockOrder = {
  _id: '1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  number: 12345,
  ingredients: ['1', '2']
};

const testState = { ...initialState };

describe('Тестирование синхронных экшенов в слайсе order', () => {
  test('Добавление ингредиента', () => {
    const stateToAdd = orderSlice(testState, addIngredient(testIngredient));
    expect(stateToAdd.current.ingredients).toHaveLength(1);
    expect(stateToAdd.current.ingredients[0]).toEqual(
      expect.objectContaining(testIngredient)
    );

    expect(stateToAdd.current.ingredients[0]).toHaveProperty('id');
  });

  test('Удаление ингредиента', () => {
    const stateToDelete = {
      ...initialState,
      current: {
        bun: null,
        ingredients: [{ ...testIngredient, id: 'test-id' }]
      }
    };

    const deleteState = orderSlice(stateToDelete, deleteIngredient('test-id'));
    expect(deleteState.current.ingredients).toHaveLength(0);
  });

  test('Создание заказа', () => {
    const historyState = orderSlice(initialState, createOrder(mockOrder));
    expect(historyState.history.orders).toHaveLength(1);
  });

  test('Перемещение ингредиентов', () => {
    const stateToShift = {
      ...initialState,
      current: {
        bun: null,
        ingredients: [
          { ...testIngredient, id: '1', name: 'Булка' },
          { ...testIngredient, id: '2', name: 'Начинка' }
        ]
      }
    };

    const shiftState = orderSlice(
      stateToShift,
      shiftIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(shiftState.current.ingredients[0].id).toBe('2');
    expect(shiftState.current.ingredients[1].id).toBe('1');
  });

  test('Удаление заказа', () => {
    const stateToResetOrder = { ...initialState, orderData: { ...mockOrder } };

    const noOrderState = orderSlice(stateToResetOrder, resetOrder());
    expect(noOrderState.orderData).toBe(null);
  });
});

describe('Тестирование асинхронных экшенов в слайсе order', () => {
  test('Установка состояния загрузки при orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(true);
  });

  test('Отправка заказа на сервер при orderBurger.fulfilled', () => {
    const result = {
      success: true,
      order: {
        _id: '',
        status: '',
        name: '',
        owner: '',
        createdAt: '',
        updatedAt: '',
        number: '',
        price: ''
      },
      name: ''
    };

    const action = { type: orderBurger.fulfilled.type, payload: result };
    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(false);
    expect(state.orderData).toEqual(expect.objectContaining(result.order));
    expect(state.current.bun).toBe(null);
    expect(state.current.ingredients).toStrictEqual([]);
  });

  test('Ошибка отправки заказа на сервер при orderBurger.rejected', () => {
    const action = { type: orderBurger.rejected.type };
    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(false);
  });

  test('Установка состояния загрузки при getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(true);
  });

  test('Получение заказа по номеру при getOrderByNumber.fulfilled', () => {
    const result = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Тестовый заказ',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        }
      ]
    };

    const action = { type: getOrderByNumber.fulfilled.type, payload: result };

    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(false);
    expect(state.orderByNumber).toEqual(result.orders[0]);
  });

  test('Ошибка загрузки при getOrderByNumber.rejected', () => {
    const action = { type: getOrderByNumber.rejected.type };
    const state = orderSlice(testState, action);
    expect(state.orderLoading).toBe(false);
  });

  test('Установка состояния загрузки при getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = orderSlice(testState, action);
    expect(state.feedLoading).toBe(true);
  });

  test('Получение списка всех заказов при getFeeds.fulfilled', () => {
    const result = {
      orders: [],
      total: 0,
      totalToday: 0
    };

    const action = { type: getFeeds.fulfilled.type, payload: result };
    const state = orderSlice(testState, action);
    expect(state.feedLoading).toBe(false);
    expect(state.feed).toEqual(result);
  });

  test('Ошибка загрузки списка заказов при getFeeds.rejected', () => {
    const action = { type: getFeeds.rejected.type };
    const state = orderSlice(testState, action);
    expect(state.feedLoading).toBe(false);
  });

  test('Установка состояния загрузки при getOrders.pending', () => {
    const action = { type: getOrders.pending.type };
    const state = orderSlice(testState, action);
    expect(state.historyLoading).toBe(true);
  });

  test('Получение списка заказов пользователя при getOrders.fulfilled', () => {
    const result = [{ ...mockOrder }, { ...mockOrder }];
    const action = {
      type: getOrders.fulfilled.type,
      payload: result
    };

    const state = orderSlice(testState, action);
    expect(state.historyLoading).toBe(false);
    expect(state.history.orders).toEqual(result);
  });

  test('Ошибка загрузки списка заказов пользователя при getOrders.rejected', () => {
    const action = { type: getOrders.rejected.type };
    const state = orderSlice(testState, action);
    expect(state.historyLoading).toBe(false);
  });
});

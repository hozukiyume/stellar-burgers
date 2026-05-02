import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  initialState,
  getIngredients
} from './ingredients-slice';

describe('Тестирование экшенов в слайсе ingredients', () => {
  const testState = { ...initialState };

  const mockIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: '',
      image_large: '',
      image_mobile: ''
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: '',
      image_large: '',
      image_mobile: ''
    }
  ];

  test('Установка состояния загрузки при getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Получение списка ингредиентов при getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('Ошибка загрузки при getIngredients.rejected', () => {
    const action = { type: getIngredients.rejected.type };
    const state = ingredientsSlice(testState, action);
    expect(state.loading).toBe(false);
  });
});

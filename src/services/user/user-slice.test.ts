import { expect, test, describe } from '@jest/globals';

import userSlice, {
  initialState,
  setInit,
  setLoading,
  setUser
} from './user-slice';

import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './user-actions';

const testState = { ...initialState };

const mockUser = {
  email: '',
  name: 'Test User'
};

const result = {
  success: true,
  refreshToken: '',
  accessToken: '',
  user: { ...mockUser }
};

describe('Тестирование синхронных экшенов в слайсе user', () => {
  test('Добавление пользователя', () => {
    const state = userSlice(testState, setUser(mockUser));
    expect(state.user).toEqual(expect.objectContaining(mockUser));
  });

  test('Установка регистрации', () => {
    const isInit = false;
    const state = userSlice(testState, setInit(isInit));
    expect(state.init).toBe(isInit);
  });

  test('Установка загрузки', () => {
    const isLoading = false;
    const state = userSlice(testState, setLoading(isLoading));
    expect(state.loading).toBe(isLoading);
  });
});

describe('Тестирование асинхронных экшенов в слайсе user', () => {
  test('Установка состояния загрузки при loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Инициализация пользователя при loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: result };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(result.user);
    expect(state.init).toBe(true);
  });

  test('Ошибка инициализации пользователя при loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
  });

  test('Установка состояния загрузки при registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Регистрация пользователя при registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: result };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(result.user);
    expect(state.init).toBe(true);
  });

  test('Ошибка регистрации пользователя при registerUser.rejected', () => {
    const action = { type: registerUser.rejected.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
  });

  test('Установка состояния загрузки при getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Получение данных пользователя при getUser.fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: result };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(result.user);
    expect(state.init).toBe(true);
  });

  test('Ошибка загрузки при getUser.rejected', () => {
    const action = { type: getUser.rejected.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
  });

  test('Установка состояния загрузки при logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Выход из учётной записи при logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.init).toBe(false);
  });

  test('Ошибка при выходе из учётной записи при logoutUser.rejected', () => {
    const action = { type: logoutUser.rejected.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
  });

  test('Установка состояния загрузки при updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(true);
  });

  test('Изменение данных пользователя при updateUser.fulfilled', () => {
    const result = {
      success: true,
      user: { ...mockUser }
    };

    const action = { type: updateUser.fulfilled.type, payload: result };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(result.user);
  });

  test('Ошибка изменения данных пользователя при updateUser.rejected', () => {
    const action = { type: updateUser.rejected.type };
    const state = userSlice(testState, action);
    expect(state.loading).toBe(false);
  });
});

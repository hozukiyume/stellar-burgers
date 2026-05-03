import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '../../utils/burger-api';

import {
  TIngredient,
  TConstructorIngredient,
  TOrder,
  TOrdersData
} from '@utils-types';

import { v4 as uuidv4 } from 'uuid';

export type TActiveOrder = {
  bun: null | TIngredient;
  ingredients: TConstructorIngredient[];
};

export const initialState: {
  orderLoading: boolean;
  feedLoading: boolean;
  historyLoading: boolean;
  current: TActiveOrder;
  orderData: TOrder | null;
  orderByNumber: TOrder | null;
  orderError: string | null;
  history: TOrdersData;
  feed: TOrdersData;
} = {
  orderLoading: false,
  feedLoading: false,
  historyLoading: false,
  current: {
    bun: null,
    ingredients: []
  },
  orderData: null,
  orderByNumber: null,
  orderError: null,
  history: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  (data: string[]) => orderBurgerApi(data)
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
);

export const getFeeds = createAsyncThunk('orders/getFeeds', getFeedsApi);

export const getOrders = createAsyncThunk('orders/getOrders', () =>
  getOrdersApi()
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.current.bun = action.payload;
        } else {
          state.current.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient) => ({
        payload:
          ingredient.type === 'bun'
            ? ingredient
            : { ...ingredient, id: uuidv4() }
      })
    },
    createOrder: (state, { payload }) => {
      state.history.orders.push(payload);
    },
    deleteIngredient: (state, { payload }) => {
      state.current.ingredients = state.current.ingredients.filter(
        (item) => item.id !== payload
      );
    },
    shiftIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      [
        state.current.ingredients[toIndex],
        state.current.ingredients[fromIndex]
      ] = [
        state.current.ingredients[fromIndex],
        state.current.ingredients[toIndex]
      ];
    },
    resetOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurger.pending, (state) => {
      state.orderLoading = true;
    });
    builder.addCase(orderBurger.fulfilled, (state, { payload }) => {
      state.orderLoading = false;
      state.orderData = {
        ...payload.order,
        ingredients: state.current.ingredients.map((item) => item._id)
      };
      state.current.bun = null;
      state.current.ingredients = [];
    });
    builder.addCase(orderBurger.rejected, (state) => {
      state.orderLoading = false;
    });

    builder.addCase(getOrderByNumber.pending, (state) => {
      state.orderLoading = true;
      state.orderByNumber = null;
      state.orderError = null;
    });
    builder.addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
      state.orderLoading = false;
      state.orderByNumber = payload.orders[0];
      state.orderError = null;
    });
    builder.addCase(getOrderByNumber.rejected, (state, action) => {
      state.orderLoading = false;
      state.orderByNumber = null;
      state.orderError = action.error?.message || 'Ошибка загрузки заказа';
    });

    builder.addCase(getFeeds.pending, (state) => {
      state.feedLoading = true;
    });
    builder.addCase(getFeeds.fulfilled, (state, { payload }) => {
      state.feedLoading = false;
      state.feed = payload;
    });
    builder.addCase(getFeeds.rejected, (state) => {
      state.feedLoading = false;
    });

    builder.addCase(getOrders.pending, (state) => {
      state.historyLoading = true;
    });
    builder.addCase(getOrders.fulfilled, (state, { payload }) => {
      state.historyLoading = false;
      state.history.orders = payload;
    });
    builder.addCase(getOrders.rejected, (state) => {
      state.historyLoading = false;
    });
  }
});

export const {
  addIngredient,
  createOrder,
  deleteIngredient,
  shiftIngredient,
  resetOrder
} = orderSlice.actions;

export default orderSlice.reducer;

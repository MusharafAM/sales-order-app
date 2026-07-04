import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import itemsReducer from './slices/itemsSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    items: itemsReducer,
    orders: ordersReducer,
  },
});

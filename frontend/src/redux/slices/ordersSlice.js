import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
} from '../../services/salesOrderService';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async () => getOrders());

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id) =>
  getOrderById(id)
);

export const saveOrder = createAsyncThunk(
  'orders/save',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return id ? await updateOrder(id, data) : await createOrder(data);
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to save the order. Please check the API is running.';
      return rejectWithValue(message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    current: null,
    listStatus: 'idle',
    currentStatus: 'idle',
    saveStatus: 'idle',
    error: null,
    saveError: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.currentStatus = 'idle';
      state.saveStatus = 'idle';
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.currentStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveOrder.pending, (state) => {
        state.saveStatus = 'saving';
        state.saveError = null;
      })
      .addCase(saveOrder.fulfilled, (state) => {
        state.saveStatus = 'succeeded';
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.payload || action.error.message;
      });
  },
});

export const { clearCurrent } = ordersSlice.actions;
export default ordersSlice.reducer;

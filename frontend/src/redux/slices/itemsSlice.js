import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getItems } from '../../services/itemService';

export const fetchItems = createAsyncThunk('items/fetchAll', async () => getItems());

const itemsSlice = createSlice({
  name: 'items',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;

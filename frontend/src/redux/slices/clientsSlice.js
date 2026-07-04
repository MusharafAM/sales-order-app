import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClients } from '../../services/clientService';

export const fetchClients = createAsyncThunk('clients/fetchAll', async () => getClients());

const clientsSlice = createSlice({
  name: 'clients',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default clientsSlice.reducer;

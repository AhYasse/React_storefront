import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '@/types';
import api from '@/services/api';
import { AxiosError } from 'axios';

// 1. STATE & TYPES

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

// 2. HELPER: Extract error message safely

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) return error.message;
  return 'Failed to fetch products';
};

// 3. ASYNC THUNK

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ products: Product[] }>('/products');
    return response.data.products;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// 4. SLICE

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const { clearProductsError } = productsSlice.actions;
export default productsSlice.reducer;
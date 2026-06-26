import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types';
import api from '@/services/api';
import { AxiosError } from 'axios';

// 1. STATE & TYPES
interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

// 2. HELPER: Extract error message safely
const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

// 3. ASYNC THUNK
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ products: any[] }>('/products');
    // NORMALISE: ensure 'id' exists (fallback to '_id' if present)
    return response.data.products.map((p) => ({
      ...p,
      id: p.id || p._id,   
    }));
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string; state: { products: ProductsState } }
>('products/fetchProductById', async (id, { getState, rejectWithValue }) => {
  try {
    // Check cache first
    const state = getState();
    const cached = state.products.items.find((p) => p.id === id);
    if (cached) return cached;

    // Not in cache → fetch from API
    const response = await api.get<{ product: any }>(`/products/${id}`);
    const product = response.data.product;
    // Normalise the single product too
    return {
      ...product,
      id: product.id || product._id,
    };
  } catch (error) {
    // If the API returns 404, we'll still reject, but we handle it in the component
    return rejectWithValue(extractErrorMessage(error));
  }
});

// 4. Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch products';
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.detailStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload || 'Failed to load product';
      });
  },
});

export const { clearProductsError, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
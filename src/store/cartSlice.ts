import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';
import api from '@/services/api';
import { withRetry } from '@/utils/retry';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  status: 'idle' | 'syncing' | 'failed';
}

const initialState: CartState = {
  items: [],
  status: 'idle',
};

// ==========================================
// ASYNC THUNKS (Optimistic + Sync + Rollback)
// ==========================================

export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async (item: CartItem, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const existingItem = state.cart.items.find((i) => i.id === item.id);

    // 1. Optimistic UI Update (Instant)
    dispatch(cartSlice.actions.addItemOptimistic(item));

    try {
      // 2. Background Sync with Retry
      await withRetry(() => api.post('/cart', { id: item.id, quantity: item.quantity }), 3);
      return item.id;
    } catch (error: any) {
      // 3. Rollback on Failure
      if (existingItem) {
        // Revert to previous quantity
        dispatch(cartSlice.actions.updateQuantityOptimistic({ 
          id: item.id, 
          quantity: existingItem.quantity 
        }));
      } else {
        // Remove the newly added item entirely
        dispatch(cartSlice.actions.removeItemOptimistic(item.id));
      }
      toast.error('Failed to add item. Changes reverted.');
      return rejectWithValue(error.response?.data?.message || 'Sync failed');
    }
  }
);

export const removeItemAsync = createAsyncThunk(
  'cart/removeItemAsync',
  async (id: string, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const previousItem = state.cart.items.find((i) => i.id === id);

    // 1. Optimistic UI Update (Instant)
    dispatch(cartSlice.actions.removeItemOptimistic(id));

    try {
      // 2. Background Sync with Retry
      await withRetry(() => api.delete(`/cart/${id}`), 3);
      return id;
    } catch (error: any) {
      // 3. Rollback on Failure
      if (previousItem) {
        dispatch(cartSlice.actions.addItemOptimistic(previousItem));
      }
      toast.error('Failed to remove item. Changes reverted.');
      return rejectWithValue(error.response?.data?.message || 'Sync failed');
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async (
    { id, quantity }: { id: string; quantity: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as { cart: CartState };
    const previousItem = state.cart.items.find((i) => i.id === id);
    const prevQuantity = previousItem ? previousItem.quantity : 0;

    // 1. Optimistic UI Update (Instant)
    dispatch(cartSlice.actions.updateQuantityOptimistic({ id, quantity }));

    try {
      // 2. Background Sync with Retry
      if (quantity <= 0) {
        await withRetry(() => api.delete(`/cart/${id}`), 3);
      } else {
        await withRetry(() => api.put(`/cart/${id}`, { quantity }), 3);
      }
      return { id, quantity };
    } catch (error: any) {
      // 3. Rollback on Failure
      dispatch(cartSlice.actions.updateQuantityOptimistic({ id, quantity: prevQuantity }));
      toast.error('Failed to update quantity. Changes reverted.');
      return rejectWithValue(error.response?.data?.message || 'Sync failed');
    }
  }
);

// ==========================================
// SLICE & PURE OPTIMISTIC REDUCERS
// ==========================================

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemOptimistic: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
    },

    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantityOptimistic: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Track global syncing state for loading spinners (optional)
    builder
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => { state.status = 'syncing'; }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => { state.status = 'idle'; }
      );
  },
});

export const { addItemOptimistic, removeItemOptimistic, updateQuantityOptimistic, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
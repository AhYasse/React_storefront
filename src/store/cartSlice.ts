import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
      //Instantly adds an item or increments its quantity in the UI.
      //(Persistence is handled automatically by Redux Persist)
     
    addItemOptimistic: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
    },

    
      //Instantly removes an item from the cart by its ID.
     
    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    
      //Instantly updates the quantity of an item. 
      //If quantity drops to 0 or below, the item is removed.
     
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

    
     // Clears all items from the cart (e.g., after a successful checkout).
     
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export actions for use in components
export const { 
  addItemOptimistic, 
  removeItemOptimistic, 
  updateQuantityOptimistic, 
  clearCart 
} = cartSlice.actions;

// Export reducer for store.ts
export default cartSlice.reducer;
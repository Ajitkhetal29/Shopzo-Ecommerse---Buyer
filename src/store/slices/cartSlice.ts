import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    minPrice?: number;
    price?: number;
    images?: any[];
  };
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.error = null;
    },
    addCartItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.error = null;
    },
    updateCartItem(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.error = null;
    },
    removeCartItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      state.error = null;
    },
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;

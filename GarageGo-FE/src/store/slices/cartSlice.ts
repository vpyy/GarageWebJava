import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
}

interface AddToCartPayload {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  error: string | null;
}

// Lưu cart theo username để không mất khi đăng xuất/đăng nhập lại
const getCartKey = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return `cart_${user.username || user.userId || 'guest'}`;
    }
  } catch {
    // ignore
  }
  return 'cart';
};

const getInitialCart = () => {
  try {
    const key = getCartKey();
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(items));
};

const initialState: CartState = {
  items: getInitialCart(),
  total: 0,
  itemCount: 0,
  isOpen: false,
  error: null,
};

// Calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    ...calculateTotals(initialState.items),
  },
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<AddToCartPayload & { isAuthenticated: boolean }>
    ) => {
      const { isAuthenticated, ...product } = action.payload;

      if (!isAuthenticated) {
        state.error = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng';
        return;
      }

      state.error = null;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + (product.quantity || 1);
        if (product.stock && newQuantity > product.stock) {
          state.error = `Chỉ còn ${product.stock} sản phẩm trong kho`;
          return;
        }
        existingItem.quantity = newQuantity;
      } else {
        if (product.stock && (product.quantity || 1) > product.stock) {
          state.error = `Chỉ còn ${product.stock} sản phẩm trong kho`;
          return;
        }
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image || '',
          stock: product.stock,
        });
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveCart(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        if (item.stock && quantity > item.stock) {
          state.error = `Chỉ còn ${item.stock} sản phẩm trong kho`;
          return;
        }

        item.quantity = Math.max(0, quantity);

        if (item.quantity === 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;

      saveCart(state.items);
    },
    clearCart: state => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.error = null;
      saveCart([]);
    },
    clearError: state => {
      state.error = null;
    },
    syncCartWithAuth: (state, action: PayloadAction<boolean>) => {
      const isAuthenticated = action.payload;
      if (!isAuthenticated) {
        // Không xóa cart khi logout - chỉ clear state, data vẫn còn trong localStorage theo username
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.error = null;
      } else {
        // Load cart của user này khi đăng nhập
        const savedCart = JSON.parse(localStorage.getItem(getCartKey()) || '[]');
        state.items = savedCart;
        const totals = calculateTotals(savedCart);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
      }
    },
    toggleCart: state => {
      state.isOpen = !state.isOpen;
    },
    openCart: state => {
      state.isOpen = true;
    },
    closeCart: state => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
  syncCartWithAuth,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;

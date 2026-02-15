/**
 * Cart and Favorites Context
 * Manages shopping cart and favorites with localStorage persistence for PWA
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const savedCart = localStorage.getItem('soulgood_cart');
        const savedFavorites = localStorage.getItem('soulgood_favorites');

        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        if (savedFavorites) {
          setFavoriteItems(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error('Failed to load from localStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFromLocalStorage();
  }, []);

  // Sync cart with backend when authenticated
  useEffect(() => {
    const syncCartWithBackend = async () => {
      if (!isAuthenticated || !user?.id) return;

      try {
        // Fetch cart from backend
        const cartRes = await fetch(`/api/cart?userId=${user.id}`);
        const cartData = await cartRes.json();

        if (cartData.items) {
          setCartItems(cartData.items);
          localStorage.setItem('soulgood_cart', JSON.stringify(cartData.items));
        }

        // Fetch favorites from backend
        const favRes = await fetch(`/api/favorites?userId=${user.id}`);
        const favData = await favRes.json();

        if (favData.favorites) {
          // Convert backend format to our format
          const favorites = favData.favorites.map(f => ({
            id: f.item_id,
            userId: f.user_id,
          }));
          setFavoriteItems(favorites);
          localStorage.setItem('soulgood_favorites', JSON.stringify(favorites));
        }
      } catch (err) {
        console.error('Failed to sync with backend:', err);
      }
    };

    if (isAuthenticated) {
      syncCartWithBackend();
    }
  }, [isAuthenticated, user]);

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('soulgood_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Save to localStorage whenever favoriteItems change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('soulgood_favorites', JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, loading]);

  /**
   * Check if item is in favorites
   */
  const isFavorite = useCallback((itemId) => {
    return favoriteItems.some(fav => fav.id === itemId);
  }, [favoriteItems]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(async (item) => {
    const itemId = item.id;
    const alreadyFavorited = isFavorite(itemId);

    // Optimistic update
    if (alreadyFavorited) {
      setFavoriteItems(prev => prev.filter(fav => fav.id !== itemId));
    } else {
      setFavoriteItems(prev => [...prev, { id: itemId, userId: user?.id }]);
    }

    // Sync with backend if authenticated
    if (isAuthenticated && user?.id) {
      try {
        if (alreadyFavorited) {
          await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, itemId }),
          });
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, itemId }),
          });
        }
      } catch (err) {
        console.error('Failed to sync favorite with backend:', err);
        // Revert optimistic update on error
        if (alreadyFavorited) {
          setFavoriteItems(prev => [...prev, { id: itemId, userId: user?.id }]);
        } else {
          setFavoriteItems(prev => prev.filter(fav => fav.id !== itemId));
        }
      }
    }
  }, [favoriteItems, isFavorite, isAuthenticated, user]);

  /**
   * Get item from cart
   */
  const getCartItem = useCallback((itemId) => {
    return cartItems.find(item => item.itemId === itemId || item.item_id === itemId);
  }, [cartItems]);

  /**
   * Get quantity for an item in cart
   */
  const getItemQuantity = useCallback((itemId) => {
    const cartItem = getCartItem(itemId);
    return cartItem ? cartItem.quantity : 0;
  }, [getCartItem]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback(async (item, quantity = 1) => {
    const itemId = item.id;
    const existingItem = getCartItem(itemId);

    // Optimistic update
    if (existingItem) {
      // Update quantity
      setCartItems(prev =>
        prev.map(cartItem =>
          (cartItem.itemId === itemId || cartItem.item_id === itemId)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      // Add new item
      const newCartItem = {
        id: Date.now(), // Temporary ID
        itemId: itemId,
        item_id: itemId,
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.image,
        userId: user?.id,
      };
      setCartItems(prev => [...prev, newCartItem]);
    }

    // Sync with backend if authenticated
    if (isAuthenticated && user?.id) {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            itemId: itemId,
            name: item.name,
            price: item.price,
            quantity: quantity,
            image: item.image,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update with backend ID if available
          if (data.id) {
            setCartItems(prev =>
              prev.map(cartItem =>
                cartItem.itemId === itemId ? { ...cartItem, id: data.id } : cartItem
              )
            );
          }
        }
      } catch (err) {
        console.error('Failed to sync cart with backend:', err);
      }
    }
  }, [cartItems, getCartItem, isAuthenticated, user]);

  /**
   * Update item quantity in cart
   */
  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(cartItemId);
    }

    // Optimistic update
    setCartItems(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated && user?.id) {
      try {
        await fetch(`/api/cart/${cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        });
      } catch (err) {
        console.error('Failed to update quantity in backend:', err);
      }
    }
  }, [isAuthenticated, user]);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback(async (cartItemId) => {
    // Optimistic update
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));

    // Sync with backend if authenticated
    if (isAuthenticated && user?.id) {
      try {
        await fetch(`/api/cart/${cartItemId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to remove item from backend:', err);
      }
    }
  }, [isAuthenticated, user]);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    setCartItems([]);

    // Sync with backend if authenticated
    if (isAuthenticated && user?.id) {
      try {
        // Delete all cart items (backend should provide a clear endpoint)
        for (const item of cartItems) {
          await fetch(`/api/cart/${item.id}`, {
            method: 'DELETE',
          });
        }
      } catch (err) {
        console.error('Failed to clear cart in backend:', err);
      }
    }
  }, [cartItems, isAuthenticated, user]);

  /**
   * Calculate cart total
   */
  const cartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cartItems]);

  /**
   * Get total number of items in cart
   */
  const cartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value = {
    // Cart
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItem,
    getItemQuantity,
    cartTotal: cartTotal(),
    cartItemCount: cartItemCount(),

    // Favorites
    favoriteItems,
    toggleFavorite,
    isFavorite,

    // Loading state
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

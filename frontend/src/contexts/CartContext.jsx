import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, total: 0, isEmpty: true });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Cargar carrito cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Limpiar carrito cuando el usuario no está autenticado
      setCart({ items: [], totalItems: 0, total: 0, isEmpty: true });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.data.cart);
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setCart({ items: [], totalItems: 0, total: 0, isEmpty: true });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para agregar productos al carrito');
    }

    try {
      setLoading(true);
      const response = await cartService.addItem(productId, quantity);
      await loadCart(); // Recargar carrito completo
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al agregar producto al carrito';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'No autenticado' };

    try {
      setLoading(true);
      const response = await cartService.updateItem(itemId, quantity);
      await loadCart(); // Recargar carrito completo
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar producto';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) return { success: false, error: 'No autenticado' };

    try {
      setLoading(true);
      const response = await cartService.removeItem(itemId);
      await loadCart(); // Recargar carrito completo
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar producto';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'No autenticado' };

    try {
      setLoading(true);
      const response = await cartService.clearCart();
      setCart({ items: [], totalItems: 0, total: 0, isEmpty: true });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al vaciar carrito';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.items.some(item => item.productId === productId);
  };

  const value = {
    cart,
    loading,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { CanteenItem, CartItem, CanteenOrder } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { 
  subscribeCanteenOrders, 
  saveCanteenOrder, 
  updateCanteenOrderStatus as fbUpdateOrderStatus 
} from '../firebase/firestoreService';
import confetti from 'canvas-confetti';

interface CanteenCartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  activeOrders: CanteenOrder[];
  addToCart: (item: CanteenItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  checkout: (paymentMethod: 'wallet' | 'upi') => { success: boolean; error?: string; order?: CanteenOrder };
  updateOrderStatus: (orderId: string, status: CanteenOrder['status']) => void;
}

const CanteenCartContext = createContext<CanteenCartContextType | undefined>(undefined);

export const CanteenCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<CanteenOrder[]>(INITIAL_ORDERS);
  const { user, deductWallet } = useAuth();
  const { addNotification } = useNotifications();

  // Real-time synchronization with Firestore collection 'canteenOrders'
  useEffect(() => {
    const unsubscribe = subscribeCanteenOrders((orders) => {
      setActiveOrders(orders);
    }, INITIAL_ORDERS);

    return () => unsubscribe();
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  const addToCart = (item: CanteenItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.item.id === itemId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = (paymentMethod: 'wallet' | 'upi') => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    if (paymentMethod === 'wallet') {
      const hasBalance = deductWallet(cartTotal);
      if (!hasBalance) {
        return {
          success: false,
          error: `Insufficient balance! Current: ₹${user?.walletBalance ?? 0}, Required: ₹${cartTotal}. Please top up your wallet.`
        };
      }
    }

    const tokenChar = ['A', 'B', 'C', 'K'][Math.floor(Math.random() * 4)];
    const tokenNum = Math.floor(10 + Math.random() * 89);
    const newToken = `${tokenChar}-${tokenNum}`;

    const newOrder: CanteenOrder = {
      id: `ord-${Date.now()}`,
      tokenNumber: newToken,
      studentId: user?.id || 'usr_guest',
      studentName: user?.name || 'Student',
      items: [...cart],
      totalAmount: cartTotal,
      status: 'Preparing',
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedPickupTime: 'In ~12-15 mins',
      counterNumber: 'Counter 1 (Main Kitchen)'
    };

    // Save to Firestore and local state
    saveCanteenOrder(newOrder);
    setActiveOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    addNotification({
      title: `Food Order Placed! Token #${newToken}`,
      message: `Your order for ₹${cartTotal} is being prepared at ${newOrder.counterNumber}.`,
      type: 'canteen',
      link: '/canteen'
    });

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: CanteenOrder['status']) => {
    fbUpdateOrderStatus(orderId, status);
    setActiveOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            estimatedPickupTime: status === 'Ready' ? 'Ready for pickup now!' : ord.estimatedPickupTime
          };
        }
        return ord;
      })
    );
  };

  return (
    <CanteenCartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        activeOrders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        updateOrderStatus
      }}
    >
      {children}
    </CanteenCartContext.Provider>
  );
};

export const useCanteenCart = () => {
  const context = useContext(CanteenCartContext);
  if (!context) {
    throw new Error('useCanteenCart must be used within a CanteenCartProvider');
  }
  return context;
};

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext.jsx';
import { SocketContext } from './SocketContext.jsx';
import { getUnreadNotificationCountAPI } from '../api/axios.js';

export const NotificationContext = createContext(null);

// Change from named export to default export for the provider component
export default function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await getUnreadNotificationCountAPI();
      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (socket && user) {
      socket.on('new_request', (data) => {
        if (data.recipientId === user._id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      socket.on('request_update', (data) => {
        if (data.recipientId === user._id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        socket.off('new_request');
        socket.off('request_update');
      };
    }
  }, [socket, user]);

  const decrementCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const resetCount = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchUnreadCount, decrementCount, resetCount }}>
      {children}
    </NotificationContext.Provider>
  );
}
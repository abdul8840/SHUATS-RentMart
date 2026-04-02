import { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../../context/SocketContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { sendMessageAPI, getMessagesAPI } from '../../api/axios.js';
import MessageBubble from './MessageBubble.jsx';
import { 
  FiSend, 
  FiArrowLeft, 
  FiMoreVertical, 
  FiPhone, 
  FiVideo,
  FiPaperclip,
  FiSmile,
  FiImage
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const { socket } = useContext(SocketContext);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = chat.participants.find(p => p._id !== user._id);

  useEffect(() => {
    fetchMessages();
    if (socket) {
      socket.emit('join_chat', chat._id);
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });
      socket.on('user_typing', () => setTyping(true));
      socket.on('user_stop_typing', () => setTyping(false));

      return () => {
        socket.emit('leave_chat', chat._id);
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('user_stop_typing');
      };
    }
  }, [chat._id, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const fetchMessages = async () => {
    try {
      const { data } = await getMessagesAPI(chat._id);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await sendMessageAPI({
        chatId: chat._id,
        content: newMessage.trim()
      });

      if (data.success) {
        setNewMessage('');
        if (socket) {
          socket.emit('stop_typing', { chatId: chat._id, userId: user._id });
        }
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket) {
      socket.emit('typing', { chatId: chat._id, userId: user._id });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { chatId: chat._id, userId: user._id });
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-cream-light to-cream">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-lg border-b border-rose-beige/20 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button - visible on mobile */}
            <button
              onClick={onBack}
              className="md:hidden p-2 rounded-xl hover:bg-mint/30 transition-all duration-300 group"
            >
              <FiArrowLeft className="w-5 h-5 text-forest group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* User info */}
            <div className="relative">
              {otherUser?.profileImage?.url ? (
                <img
                  src={otherUser.profileImage.url}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-mint/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {otherUser?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
            </div>

            <div>
              <h4 className="font-semibold text-forest-dark">{otherUser?.name}</h4>
              <p className="text-xs text-sage">{otherUser?.department || 'Online'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2.5 rounded-xl hover:bg-mint/30 transition-all duration-300 group hidden sm:block">
              <FiPhone className="w-5 h-5 text-forest group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-mint/30 transition-all duration-300 group hidden sm:block">
              <FiVideo className="w-5 h-5 text-forest group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-mint/30 transition-all duration-300 group">
              <FiMoreVertical className="w-5 h-5 text-forest group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Item reference */}
        {chat.item && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-mint/20 animate-fade-in">
            <HiOutlineSparkles className="w-4 h-4 text-forest flex-shrink-0" />
            <span className="text-sm text-forest truncate">
              Discussing: <span className="font-medium">{chat.item.title}</span>
            </span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-sage animate-bounce-soft"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-rose-beige text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mint/50 to-sage/50 flex items-center justify-center mb-4">
              <HiOutlineSparkles className="w-10 h-10 text-forest" />
            </div>
            <h4 className="text-lg font-semibold text-forest-dark mb-1">
              Start the conversation
            </h4>
            <p className="text-rose-beige text-sm text-center max-w-xs">
              Say hello to {otherUser?.name} and begin your conversation!
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-3">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <div className="px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm shadow-sm">
                  <span className="text-xs font-medium text-rose-beige">
                    {formatDateHeader(date)}
                  </span>
                </div>
              </div>
              
              {/* Messages for this date */}
              {dateMessages.map((msg, index) => (
                <MessageBubble 
                  key={msg._id} 
                  message={msg}
                  showAvatar={
                    index === 0 || 
                    dateMessages[index - 1]?.sender?._id !== msg.sender?._id
                  }
                />
              ))}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint to-sage flex items-center justify-center text-white text-xs font-bold">
              {otherUser?.name?.charAt(0)}
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white shadow-sm">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-sage animate-bounce-soft"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-white/80 backdrop-blur-lg border-t border-rose-beige/20">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          {/* Attachment buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              className="p-2.5 rounded-xl hover:bg-mint/30 transition-all duration-300 group"
            >
              <FiPaperclip className="w-5 h-5 text-rose-beige group-hover:text-forest transition-colors" />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-xl hover:bg-mint/30 transition-all duration-300 group"
            >
              <FiImage className="w-5 h-5 text-rose-beige group-hover:text-forest transition-colors" />
            </button>
          </div>

          {/* Input field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-cream border border-rose-beige/30
                       focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
                       placeholder:text-rose-beige/60 text-forest-dark transition-all duration-300
                       resize-none"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-mint/30 transition-colors"
            >
              <FiSmile className="w-5 h-5 text-rose-beige hover:text-forest transition-colors" />
            </button>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`
              p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center
              ${newMessage.trim() && !sending
                ? 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/30 hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-rose-beige/30 text-rose-beige cursor-not-allowed'
              }
            `}
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSend className={`w-5 h-5 ${newMessage.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
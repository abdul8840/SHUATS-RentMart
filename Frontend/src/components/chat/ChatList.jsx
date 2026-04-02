import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { format, isToday, isYesterday } from 'date-fns';
import { FiSearch, FiX } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');

  const getOtherUser = (chat) => {
    return chat.participants.find(p => p._id !== user._id);
  };

  const formatMessageTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return 'Yesterday';
    }
    return format(messageDate, 'dd/MM');
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = getOtherUser(chat);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-cream-light/50">
      {/* Search Header */}
      <div className="p-4 border-b border-rose-beige/20">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-beige" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/80 border border-rose-beige/30 
                     focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none
                     placeholder:text-rose-beige/60 text-forest-dark transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-rose-beige/20 transition-colors"
            >
              <FiX className="w-4 h-4 text-rose-beige" />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-mint/30 flex items-center justify-center mb-4">
              <HiOutlineSparkles className="w-8 h-8 text-sage" />
            </div>
            <p className="text-rose-beige text-center">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-rose-beige/60 text-center mt-1">
              {searchQuery ? 'Try a different search' : 'Start chatting with someone!'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredChats.map((chat, index) => {
              const otherUser = getOtherUser(chat);
              const isOnline = onlineUsers?.includes(otherUser?._id);
              const isSelected = selectedChat?._id === chat._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => onSelectChat(chat)}
                  className={`
                    relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer
                    transition-all duration-300 group animate-slide-right
                    ${isSelected 
                      ? 'bg-gradient-to-r from-forest to-sage text-white shadow-lg shadow-forest/20' 
                      : 'hover:bg-white/80 hover:shadow-md'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {otherUser?.profileImage?.url ? (
                      <img
                        src={otherUser.profileImage.url}
                        alt={otherUser.name}
                        className={`
                          w-14 h-14 rounded-2xl object-cover transition-transform duration-300
                          ${isSelected ? 'ring-2 ring-white/50' : 'group-hover:scale-105'}
                        `}
                      />
                    ) : (
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center
                        text-xl font-bold transition-all duration-300
                        ${isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gradient-to-br from-mint to-sage text-white group-hover:shadow-md'
                        }
                      `}>
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Online indicator */}
                    {isOnline && (
                      <span className={`
                        absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 
                        bg-green-500 animate-pulse-soft
                        ${isSelected ? 'border-sage' : 'border-cream-light'}
                      `} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`
                        font-semibold truncate transition-colors
                        ${isSelected ? 'text-white' : 'text-forest-dark'}
                      `}>
                        {otherUser?.name}
                      </h4>
                      <span className={`
                        text-xs flex-shrink-0 ml-2
                        ${isSelected ? 'text-white/80' : 'text-rose-beige'}
                      `}>
                        {formatMessageTime(chat.lastMessageAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`
                        text-sm truncate pr-2
                        ${isSelected ? 'text-white/80' : 'text-rose-beige'}
                      `}>
                        {chat.lastMessage?.content || 'Start a conversation'}
                      </p>
                      
                      {chat.unreadCount > 0 && !isSelected && (
                        <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full 
                                       bg-gradient-to-r from-forest to-sage text-white 
                                       text-xs font-bold flex items-center justify-center
                                       animate-scale-in shadow-md shadow-forest/30">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Item reference badge */}
                    {chat.item && (
                      <div className={`
                        mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs
                        ${isSelected ? 'bg-white/20 text-white' : 'bg-mint/30 text-forest'}
                      `}>
                        <span className="truncate max-w-[150px]">
                          Re: {chat.item.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-white" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
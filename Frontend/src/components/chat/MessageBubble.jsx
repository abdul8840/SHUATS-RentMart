import { useAuth } from '../../hooks/useAuth.js';
import { format } from 'date-fns';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';

const MessageBubble = ({ message, showAvatar = true }) => {
  const { user } = useAuth();
  const isMine = message.sender._id === user._id || message.sender === user._id;

  return (
    <div 
      className={`flex items-end gap-2 animate-slide-up ${isMine ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {!isMine && showAvatar ? (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-mint to-sage flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {message.sender?.name?.charAt(0).toUpperCase() || '?'}
        </div>
      ) : !isMine ? (
        <div className="w-8" /> // Spacer for alignment
      ) : null}

      {/* Message content */}
      <div className={`max-w-[75%] sm:max-w-[65%] ${isMine ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            relative group px-4 py-3 rounded-2xl shadow-sm transition-all duration-300
            ${isMine
              ? 'bg-gradient-to-br from-forest to-sage text-white rounded-br-md'
              : 'bg-white text-forest-dark rounded-bl-md hover:shadow-md'
            }
          `}
        >
          {/* Image attachment */}
          {message.messageType === 'image' && message.imageUrl?.url && (
            <div className="mb-2 -mx-1 -mt-1 overflow-hidden rounded-xl">
              <img
                src={message.imageUrl.url}
                alt="Shared image"
                className="max-w-full max-h-64 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity"
                loading="lazy"
              />
            </div>
          )}

          {/* Message text */}
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Time and status */}
          <div className={`flex items-center gap-1.5 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${isMine ? 'text-white/70' : 'text-rose-beige'}`}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
            
            {isMine && (
              <span className="text-white/70">
                {message.isRead ? (
                  <FiCheckCircle className="w-3 h-3" />
                ) : (
                  <FiCheck className="w-3 h-3" />
                )}
              </span>
            )}
          </div>

          {/* Decorative tail */}
          <div
            className={`
              absolute bottom-0 w-3 h-3
              ${isMine 
                ? '-right-1 bg-sage' 
                : '-left-1 bg-white'
              }
            `}
            style={{
              clipPath: isMine 
                ? 'polygon(0 0, 100% 100%, 0 100%)' 
                : 'polygon(100% 0, 100% 100%, 0 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
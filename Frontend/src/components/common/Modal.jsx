import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  /* lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="
          absolute inset-0 bg-black/50 backdrop-blur-sm
          animate-fade-in
        "
      />

      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full ${sizeMap[size]}
          bg-[var(--color-cream-light)]
          rounded-2xl shadow-2xl shadow-black/20
          border border-[var(--color-rose-beige)]/50
          overflow-hidden animate-scale-in
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-5 py-4 flex-shrink-0
          border-b border-[var(--color-rose-beige)]/40
          bg-gradient-to-r from-[var(--color-mint-light)]/60 to-[var(--color-cream)]
        ">
          <div className="flex items-center gap-2.5">
            {/* Accent bar */}
            <div className="w-1 h-5 rounded-full gradient-bg" />
            <h2 className="font-bold text-gray-800 text-base">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-xl flex items-center justify-center
              text-gray-500 bg-[var(--color-cream)]
              border border-[var(--color-rose-beige)]/60
              hover:bg-red-50 hover:text-red-500 hover:border-red-200
              hover:scale-110 cursor-pointer
              transition-all duration-200
            "
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
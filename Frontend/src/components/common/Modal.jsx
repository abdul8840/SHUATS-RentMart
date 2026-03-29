import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>{title}</h2>
          <button onClick={onClose}><FiX /></button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
import Modal from './Modal.jsx';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = 'red', loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'}>
      <div>
        <p>{message || 'Are you sure you want to proceed?'}</p>
        <div>
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} data-color={confirmColor}>
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
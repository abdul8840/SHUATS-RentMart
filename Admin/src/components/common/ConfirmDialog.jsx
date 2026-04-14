import Modal from './Modal.jsx';
import { FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  confirmColor = 'red', 
  loading = false 
}) => {
  const getIcon = () => {
    switch (confirmColor) {
      case 'red':
        return <FiAlertTriangle className="w-6 h-6 text-red-600" />;
      case 'green':
        return <FiCheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <FiInfo className="w-6 h-6 text-blue-600" />;
    }
  };

  const getButtonClass = () => {
    switch (confirmColor) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {message || 'Are you sure you want to proceed?'}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${getButtonClass()}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
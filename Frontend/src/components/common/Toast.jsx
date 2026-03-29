import toast from 'react-hot-toast';

const toastBase = {
  duration: 4000,
  style: {
    background: 'var(--color-cream-light)',
    color: '#1a1a1a',
    border: '1px solid var(--color-rose-beige)',
    borderRadius: '16px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 24px rgba(64,145,108,0.12)',
  },
};

export const showSuccess = (message) =>
  toast.success(message, {
    ...toastBase,
    iconTheme: {
      primary: 'var(--color-forest)',
      secondary: 'white',
    },
  });

export const showError = (message) =>
  toast.error(message, {
    ...toastBase,
    iconTheme: {
      primary: '#ef4444',
      secondary: 'white',
    },
  });

export const showInfo = (message) =>
  toast(message, {
    ...toastBase,
    icon: 'ℹ️',
  });

export const showLoading = (message = 'Loading…') =>
  toast.loading(message, {
    ...toastBase,
  });
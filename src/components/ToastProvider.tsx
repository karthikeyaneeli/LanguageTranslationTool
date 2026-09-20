import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--card-bg)',
          color: 'var(--text-main)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'var(--card-shadow)',
        },
        success: {
          iconTheme: {
            primary: '#22C55E',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;

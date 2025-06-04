import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastType } from './Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  duration: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
    duration: 3000,
  });

  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    setToast({
      message,
      type,
      visible: true,
      duration,
    });
  };

  const showSuccess = (message: string, duration: number = 3000) => {
    showToast(message, 'success', duration);
  };

  const showError = (message: string, duration: number = 4000) => {
    showToast(message, 'error', duration);
  };

  const showWarning = (message: string, duration: number = 3500) => {
    showToast(message, 'warning', duration);
  };

  const showInfo = (message: string, duration: number = 3000) => {
    showToast(message, 'info', duration);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider; 
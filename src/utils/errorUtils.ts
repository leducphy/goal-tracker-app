export interface ErrorDetails {
  title: string;
  message: string;
  code?: string;
}

export class AppError extends Error {
  public readonly title: string;
  public readonly code?: string;

  constructor(title: string, message: string, code?: string) {
    super(message);
    this.title = title;
    this.code = code;
    this.name = 'AppError';
  }
}

export const formatAuthError = (error: any): ErrorDetails => {
  if (error instanceof AppError) {
    return {
      title: error.title,
      message: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    const errorMsg = error.message.toLowerCase();
    
    // Google Sign-In specific errors
    if (errorMsg.includes('play services')) {
      return {
        title: 'Google Play Services',
        message: 'Vui lòng cập nhật Google Play Services để sử dụng tính năng này.',
        code: 'PLAY_SERVICES_ERROR'
      };
    }
    
    if (errorMsg.includes('network') || errorMsg.includes('connection')) {
      return {
        title: 'Lỗi kết nối',
        message: 'Vui lòng kiểm tra kết nối internet và thử lại.',
        code: 'NETWORK_ERROR'
      };
    }
    
    if (errorMsg.includes('configuration') || errorMsg.includes('client_id')) {
      return {
        title: 'Lỗi cấu hình',
        message: 'Ứng dụng chưa được cấu hình đúng. Vui lòng liên hệ hỗ trợ.',
        code: 'CONFIG_ERROR'
      };
    }
    
    if (errorMsg.includes('too many requests') || errorMsg.includes('rate limit')) {
      return {
        title: 'Quá nhiều yêu cầu',
        message: 'Bạn đã thử quá nhiều lần. Vui lòng đợi một chút và thử lại.',
        code: 'RATE_LIMIT_ERROR'
      };
    }

    if (errorMsg.includes('user-disabled')) {
      return {
        title: 'Tài khoản bị khóa',
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.',
        code: 'USER_DISABLED'
      };
    }

    // Generic error with original message
    return {
      title: 'Có lỗi xảy ra',
      message: error.message,
    };
  }

  // Fallback for unknown errors
  return {
    title: 'Lỗi không xác định',
    message: 'Có lỗi xảy ra. Vui lòng thử lại.',
  };
};

export const logError = (context: string, error: any, additionalInfo?: any) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    error: {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: __DEV__ ? error?.stack : undefined,
    },
    additionalInfo,
  };
  
  console.error(`[${context}] Error:`, errorInfo);
  
  // In production, you might want to send this to a logging service
  // if (!__DEV__) {
  //   sendToLoggingService(errorInfo);
  // }
}; 
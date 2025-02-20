
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id?: string;
            photo_url?: string;
            username?: string;
            first_name?: string;
          };
        };
      };
    };
  }
}

export const getTelegramUser = () => {
  // For development/testing purposes, return a mock user if Telegram WebApp is not available
  if (process.env.NODE_ENV === 'development' && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return {
      id: 'test_user_id',
      username: 'test_user',
      first_name: 'Test User',
      photo_url: ''
    };
  }

  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }

  return null;
};

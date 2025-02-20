
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id?: string;
            photo_url?: string;
            username?: string;
            first_name?: string;
          };
          start_param?: string;
        };
      };
    };
  }
}

export const getTelegramUser = () => {
  // For development/testing purposes, return a mock user if Telegram WebApp is not available
  if (process.env.NODE_ENV === 'development' && !window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return {
      id: 'guest_id',
      username: 'Гость',
      first_name: 'Гость',
      photo_url: ''
    };
  }

  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }

  return null;
};

export const getInitData = () => {
  return window.Telegram?.WebApp?.initData || '';
};

export const getStartParam = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
};

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
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
        showPopup: (params: { title?: string, message: string, buttons?: Array<{ id: string, type?: string, text: string }> }) => void;
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

export const shareToTelegramContacts = (text: string): boolean => {
  // Check if we're in a Telegram WebApp environment
  if (window.Telegram?.WebApp?.switchInlineQuery) {
    try {
      // This opens the contact selection interface while keeping the app open
      // The first parameter is the text to share
      // The second parameter is an array of chat types to filter by (users, groups, etc.)
      window.Telegram.WebApp.switchInlineQuery(text, ['users', 'groups']);
      return true;
    } catch (error) {
      console.error('Error using Telegram WebApp sharing:', error);
    }
  }
  
  // Return false if sharing via WebApp failed or is not available
  return false;
};

export const openTelegramLink = (url: string): void => {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    try {
      window.Telegram.WebApp.openTelegramLink(url);
    } catch (error) {
      // Fallback to standard link opening if openTelegramLink fails
      if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  } else if (window.Telegram?.WebApp?.openLink) {
    window.Telegram.WebApp.openLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

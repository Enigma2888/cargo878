
export const encodeReferralData = (userId: string) => {
  const data = { referrer: userId };
  return btoa(JSON.stringify(data));
};

export const decodeReferralData = (encodedData: string): { referrer: string } | null => {
  try {
    return JSON.parse(atob(encodedData));
  } catch (e) {
    console.error('Failed to decode referral data:', e);
    return null;
  }
};

export const createShareLink = (userId: string) => {
  const encoded = encodeReferralData(userId);
  return `tg://resolve?domain=infocargo878_bot&startapp=${encoded}`;
};

export const createTelegramShareLink = (userId: string) => {
  const referralLink = createShareLink(userId);
  const text = encodeURIComponent('Присоединяйся к нам используя мою реферальную ссылку!');
  return `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
};

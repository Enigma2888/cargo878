
import { supabase } from "@/lib/supabase";
import { getTelegramUser, getStartParam } from "./telegram";

export const createShareLink = (userId: string) => {
  // Кодируем только ID пользователя в base64
  const encoded = btoa(userId);
  return `https://t.me/infocargo878_bot/app?startapp=${encoded}`;
};

export const createTelegramShareLink = (userId: string) => {
  const referralLink = createShareLink(userId);
  const text = encodeURIComponent('Присоединяйтесь к нашему сервису и получите 500 баллов на первый заказ! 🎁');
  return `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
};

export const trackReferralClick = async (referrerId: string) => {
  try {
    console.log('Tracking referral click for:', referrerId);
    const { error } = await supabase
      .from('referral_clicks')
      .insert([{ referrer_id: referrerId }]);
    
    if (error) {
      console.error('Error tracking referral click:', error);
      throw error;
    }
    console.log('Referral click tracked successfully');
  } catch (error) {
    console.error('Error in trackReferralClick:', error);
    throw error;
  }
};

export const processReferralParams = async () => {
  const currentUser = getTelegramUser();
  if (!currentUser?.id) {
    console.log('No current user found');
    return;
  }

  try {
    // Получаем параметр startapp из URL или из initData
    const urlParams = new URLSearchParams(window.location.search);
    const startAppParam = urlParams.get('startapp') || getStartParam();
    
    if (!startAppParam) {
      console.log('No startapp parameter found');
      return;
    }

    try {
      // Декодируем параметр startapp (теперь он содержит только ID)
      const referrerId = atob(startAppParam);

      console.log('Decoded referrer ID:', referrerId);

      if (!referrerId || referrerId === currentUser.id) {
        console.log('Invalid referrer ID or self-referral attempted');
        return;
      }

      // Проверяем, не является ли пользователь уже чьим-то рефералом
      const { data: existingReferral, error: checkError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referee_id', currentUser.id)
        .maybeSingle();

      if (checkError) {
        throw new Error(`Failed to check existing referral: ${checkError.message}`);
      }

      if (existingReferral) {
        console.log('User is already a referral');
        return;
      }

      // Проверяем существование реферера
      const { data: referrer, error: referrerError } = await supabase
        .from('telegram_users')
        .select('id')
        .eq('id', referrerId)
        .maybeSingle();

      if (referrerError || !referrer) {
        console.error('Referrer does not exist:', referrerError);
        return;
      }

      console.log('Creating new referral relationship');
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referee_id: currentUser.id
        });

      if (referralError) {
        throw new Error(`Failed to create referral: ${referralError.message}`);
      }
      
      // После успешного создания реферала записываем клик
      await trackReferralClick(referrerId);
      console.log('Referral processing completed successfully');
      return true;

    } catch (decodeError) {
      console.error('Failed to decode startapp parameter:', decodeError);
      return false;
    }

  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

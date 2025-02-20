
import { supabase } from "@/lib/supabase";
import { getTelegramUser } from "./telegram";

export const createShareLink = (userId: string) => {
  const data = { referrer: userId };
  const encoded = btoa(JSON.stringify(data));
  return `tg://resolve?domain=infocargo878_bot&startapp=${encoded}`;
};

export const createTelegramShareLink = (userId: string) => {
  const referralLink = createShareLink(userId);
  const text = encodeURIComponent('Присоединяйся к нам используя мою реферальную ссылку!');
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
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const startApp = urlParams.get('startapp');
    
    if (!startApp) {
      console.log('No startapp parameter found');
      return;
    }

    // Декодируем параметр startapp
    try {
      const decodedData = JSON.parse(atob(startApp));
      const referrerId = decodedData.referrer;

      if (!referrerId || referrerId === currentUser.id) {
        console.log('Invalid referrer ID or self-referral attempted');
        return;
      }

      console.log('Processing referral with data:', {
        referrerId,
        currentUserId: currentUser.id
      });

      // Проверяем существующий реферал
      const { data: existingReferral, error: checkError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referee_id', currentUser.id)
        .maybeSingle();

      if (checkError) {
        throw new Error(`Failed to check existing referral: ${checkError.message}`);
      }

      // Если реферала нет, создаём новый
      if (!existingReferral) {
        console.log('Creating new referral');
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
      } else {
        console.log('Referral already exists');
      }

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

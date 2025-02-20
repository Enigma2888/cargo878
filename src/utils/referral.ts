
import { supabase } from "@/lib/supabase";
import { getTelegramUser } from "./telegram";

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

    // Сначала проверяем существующий реферал
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referee_id', currentUser.id)
      .maybeSingle();

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
    } else {
      console.log('Referral already exists');
    }

    // Всегда записываем клик
    console.log('Recording referral click');
    const { error: clickError } = await supabase
      .from('referral_clicks')
      .insert({
        referrer_id: referrerId
      });

    if (clickError) {
      throw new Error(`Failed to record click: ${clickError.message}`);
    }

    console.log('Referral processing completed successfully');
    return true;

  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

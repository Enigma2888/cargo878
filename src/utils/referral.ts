
import { supabase } from "@/lib/supabase";

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

export const processReferral = async (referrerId: string, refereeId: string) => {
  try {
    if (referrerId === refereeId) {
      console.log('Self-referral attempted');
      return;
    }

    console.log('Processing referral:', { referrerId, refereeId });

    // Сначала проверяем, существует ли уже такой реферал
    const { data: existingReferral, error: checkError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referee_id', refereeId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing referral:', checkError);
      throw checkError;
    }

    if (!existingReferral) {
      // Если реферала нет, создаем новый
      const { error: createError } = await supabase
        .from('referrals')
        .insert([
          {
            referrer_id: referrerId,
            referee_id: refereeId
          }
        ]);

      if (createError) {
        console.error('Error creating referral:', createError);
        throw createError;
      }
      console.log('Referral created successfully');
    } else {
      console.log('Referral already exists');
    }

    // В любом случае записываем клик
    await trackReferralClick(referrerId);

  } catch (error) {
    console.error('Error in processReferral:', error);
    throw error;
  }
};

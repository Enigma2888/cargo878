import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getTelegramUser, shareToTelegramContacts, openTelegramLink } from "@/utils/telegram";
import { createShareLink, createTelegramShareLink, trackReferralClick } from "@/utils/referral";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const Partnership = () => {
  const {
    toast
  } = useToast();
  const user = getTelegramUser();
  const [isCopied, setIsCopied] = useState(false);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const startapp = searchParams.get('startapp');
    if (startapp) {
      try {
        const data = JSON.parse(atob(startapp));
        if (data.referrer) {
          trackReferralClick(data.referrer).then(() => {
            console.log('Referral click tracked successfully');
          }).catch(error => {
            console.error('Error tracking referral click:', error);
          });
        }
      } catch (error) {
        console.error('Error processing referral data:', error);
      }
    }
  }, [searchParams]);
  const {
    data: referralsCount = 0,
    refetch: refetchReferrals
  } = useQuery({
    queryKey: ['referrals-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const {
        count,
        error
      } = await supabase.from('referrals').select('*', {
        count: 'exact',
        head: true
      }).eq('referrer_id', user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id
  });
  const {
    data: clicksCount = 0,
    refetch: refetchClicks
  } = useQuery({
    queryKey: ['referral-clicks-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const {
        count,
        error
      } = await supabase.from('referral_clicks').select('*', {
        count: 'exact',
        head: true
      }).eq('referrer_id', user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id
  });
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel('referral-updates').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'referral_clicks',
      filter: `referrer_id=eq.${user.id}`
    }, () => {
      console.log('Referral click detected, refreshing data...');
      refetchClicks();
    }).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'referrals',
      filter: `referrer_id=eq.${user.id}`
    }, () => {
      console.log('Referral created, refreshing data...');
      refetchReferrals();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetchClicks, refetchReferrals]);
  const handleCopyLink = async () => {
    if (!user?.id) {
      toast({
        title: "Требуется авторизация",
        description: "Для копирования ссылки необходимо авторизоваться"
      });
      return;
    }
    const link = createShareLink(user.id);
    await navigator.clipboard.writeText(link);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Ссылка скопирована",
      description: "Теперь вы можете отправить её друзьям"
    });
  };
  const handleShareToTelegram = () => {
    if (!user?.id) {
      toast({
        title: "Требуется авторизация",
        description: "Для отправки ссылки необходимо авторизоваться"
      });
      return;
    }
    const link = createShareLink(user.id);
    const shareText = 'Присоединяйтесь к нашему сервису и получите 500 баллов на первый заказ! 🎁\n\n' + link;
    const sharedViaWebApp = shareToTelegramContacts(shareText);
    if (!sharedViaWebApp) {
      const shareUrl = createTelegramShareLink(user.id);
      openTelegramLink(shareUrl);
    }
  };
  return <div className="min-h-screen bg-[#1A1F2C] text-white pb-20">
      <Header />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Приглашай друзей!</h1>
          <div className="text-xl mb-2">
            <span className="text-white">Дарим по </span>
            <span className="text-[#FF6B6B]">300 рублей</span>
            <span className="text-white"> каждому!</span>
          </div>
          <p className="text-gray-400 text-sm">
            Получи за каждое приглашение по твоей реферальной ссылке{' '}
            <span className="text-[#FF6B6B]">500 баллов</span>. Также{' '}
            <span className="text-[#FF6B6B]">500 баллов</span> получит твой друг.
          </p>
        </div>

        <div className="bg-[#2A2F3C] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#FFD700]">👑</span>
            <span className="text-gray-300">1 балл = 1 рубль</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Баллами можно оплачивать до 100% покупок.
          </p>
          <div className="bg-black/20 rounded-lg p-3 text-sm text-gray-400">
            Баллы начисляются после того, как приглашённый пользователь совершит покупку.
          </div>
        </div>

        <div className="bg-[#2A2F3C] rounded-xl p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Твоя ссылка на приглашение</h3>
          <Button onClick={handleCopyLink} className={`w-full transition-all duration-200 ${isCopied ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-black hover:bg-white/90'} mb-4`}>
            {isCopied ? <>
                <Check className="w-4 h-4 mr-2" />
                Скопировано
              </> : <>
                <Copy className="w-4 h-4 mr-2" />
                Скопировать
              </>}
          </Button>
          <Button onClick={handleShareToTelegram} className="w-full" variant="secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться в Telegram
          </Button>
        </div>

        <div className="bg-[#2A2F3C] rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Переходов по ссылке</span>
              <span className="font-medium">{clicksCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Сделали заказ</span>
              <span className="font-medium">{referralsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Отправили в РФ</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="font-medium">Всего баллов заработано</span>
              <span className="font-medium">{referralsCount * 500}</span>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>;
};
export default Partnership;
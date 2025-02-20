
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getTelegramUser } from "@/utils/telegram";
import { createShareLink, createTelegramShareLink } from "@/utils/referral";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const Partnership = () => {
  const { toast } = useToast();
  const user = getTelegramUser();

  const { data: referralsCount = 0 } = useQuery({
    queryKey: ['referrals-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count, error } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id
  });

  const handleCopyLink = async () => {
    if (!user?.id) return;
    
    const link = createShareLink(user.id);
    await navigator.clipboard.writeText(link);
    
    toast({
      title: "Ссылка скопирована",
      description: "Теперь вы можете отправить её друзьям"
    });
  };

  const handleShareToTelegram = () => {
    if (!user?.id) return;
    
    const shareUrl = createTelegramShareLink(user.id);
    window.open(shareUrl, '_blank', 'popup=yes');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-[#1A1F2C] text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Ошибка</h1>
        <p className="text-gray-400">Не удалось получить данные пользователя</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white pb-20">
      <Header />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Приглашай друзей!</h1>
          <div className="text-xl mb-2">
            <span className="text-white">Дарим по </span>
            <span className="text-[#FF6B6B]">500 рублей</span>
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
          <Button 
            onClick={handleCopyLink}
            className="w-full bg-white text-black hover:bg-white/90 mb-4"
          >
            <Copy className="w-4 h-4 mr-2" />
            Скопировать
          </Button>
          <Button 
            onClick={handleShareToTelegram}
            className="w-full"
            variant="secondary"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться в Telegram
          </Button>
        </div>

        <div className="bg-[#2A2F3C] rounded-xl p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Переходов по ссылке</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Сделали заказ</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Отправили в РФ</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="font-medium">Всего баллов заработано</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Partnership;

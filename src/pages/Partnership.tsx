
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
        <div className="bg-[#2A2F3C] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Партнерская программа</h2>
          <p className="text-gray-400 mb-6">
            Приглашайте друзей и получайте бонусы за каждого приглашенного пользователя
          </p>
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleCopyLink}
              className="w-full"
              variant="secondary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Копировать ссылку
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
        </div>

        <div className="bg-[#2A2F3C] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Статистика</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Пригласил друзей</span>
            <span className="text-xl font-bold">{referralsCount}</span>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Partnership;

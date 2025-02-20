
import { Clock } from "lucide-react";
import { useEffect } from "react";
import { getTelegramUser, getInitData } from "@/utils/telegram";
import { saveUserData } from "@/lib/supabase";
import { processReferralParams } from "@/utils/referral";
import * as UAParser from "ua-parser-js";

export const LoadingScreen = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Получаем данные пользователя
        const telegramUser = getTelegramUser();
        const initData = getInitData();

        if (!telegramUser) {
          console.error('No Telegram user data available');
          return;
        }

        // Сохраняем данные пользователя
        const parser = new UAParser.UAParser();
        const device = `${parser.getOS().name} ${parser.getBrowser().name}`;
          
        await saveUserData({
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          username: telegramUser.username,
          photo_url: telegramUser.photo_url,
          device
        });

        // Обрабатываем реферальные данные
        await processReferralParams();
        
      } catch (error) {
        console.error('Error during app initialization:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] flex items-center justify-center">
      <div className="animate-spin">
        <Clock className="w-12 h-12 text-[#9B7E3B]" />
      </div>
    </div>
  );
};

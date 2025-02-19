import { useState, useEffect } from "react";
import { getTelegramUser } from "@/utils/telegram";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export const Header = () => {
  const [user, setUser] = useState<{
    photo_url?: string;
    username?: string;
    first_name?: string;
  } | null>(null);
  useEffect(() => {
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);
  return <header className="fixed top-0 left-0 right-0 bg-[#1A1F2C]/80 backdrop-blur-md z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photo_url} alt={user?.first_name || user?.username || "Profile"} className="object-cover" />
              <AvatarFallback className="bg-[#2A2F3C] text-white mx-0 font-normal">
                {(user?.first_name?.[0] || user?.username?.[0] || "G").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-white text-lg">
              Привет, <span className="font-medium">{user?.first_name || user?.username || "Guest"}</span>
            </h1>
          </div>
        </div>
      </div>
    </header>;
};
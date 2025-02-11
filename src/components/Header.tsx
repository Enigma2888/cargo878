
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-1">
            <h1 className="text-xl font-medium text-gray-900">
              Hello,{" "}
              <span className="text-primary font-semibold">
                {user?.first_name || user?.username || "Guest"}
              </span>
            </h1>
          </div>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 transition-transform hover:scale-105">
              <AvatarImage
                src={user?.photo_url}
                alt={user?.first_name || user?.username || "Profile"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {(user?.first_name?.[0] || user?.username?.[0] || "G").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

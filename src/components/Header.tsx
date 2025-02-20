
import { getTelegramUser } from "@/utils/telegram";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const user = getTelegramUser();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F2C] border-b border-white/10 z-50">
      <div className="h-full max-w-md mx-auto px-4 flex items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.photo_url} />
            <AvatarFallback>
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-white">
            Привет, {user?.first_name || user?.username || 'Гость'}
          </span>
        </div>
      </div>
    </header>
  );
};

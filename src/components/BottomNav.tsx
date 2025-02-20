
import { Home, Users, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-[#9B7E3B]" : "text-white/60";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1A1F2C] border-t border-white/10">
      <div className="h-full max-w-md mx-auto px-4 flex items-center justify-around">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 ${isActive('/')}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Главная</span>
        </Link>
        <Link 
          to="/partnership" 
          className={`flex flex-col items-center gap-1 ${isActive('/partnership')}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs">Партнерам</span>
        </Link>
      </div>
    </div>
  );
};

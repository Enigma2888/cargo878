
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F2C] border-b border-white/10 z-50">
      <div className="h-full max-w-md mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold">
          GORSKY
        </Link>
        <Link 
          to="/partnership" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
        >
          <Users className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};

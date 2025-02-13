
import { Clock } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-[#1A1F2C] flex items-center justify-center">
      <div className="animate-spin">
        <Clock className="w-12 h-12 text-[#9B7E3B]" />
      </div>
    </div>
  );
};

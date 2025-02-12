
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-8 h-8 bg-white/10 hover:bg-white/20"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-[#9B7E3B]" />
      ) : (
        <Moon className="h-4 w-4 text-[#9B7E3B]" />
      )}
    </Button>
  );
};

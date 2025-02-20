
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Partnership from "./pages/Partnership";
import { supabase } from "./lib/supabase";
import { getTelegramUser } from "./utils/telegram";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const startApp = urlParams.get('startapp');
      const currentUser = getTelegramUser();

      if (startApp && currentUser?.id) {
        try {
          const decodedData = JSON.parse(atob(startApp));
          
          if (decodedData.referrer && decodedData.referrer !== currentUser.id) {
            // Проверяем, не является ли пользователь уже чьим-то рефералом
            const { data: existingReferral } = await supabase
              .from('referrals')
              .select('*')
              .eq('referee_id', currentUser.id)
              .single();

            if (!existingReferral) {
              // Если пользователь еще не является чьим-то рефералом, добавляем запись
              await supabase
                .from('referrals')
                .insert({
                  referrer_id: decodedData.referrer,
                  referee_id: currentUser.id
                });
            }
          }
        } catch (e) {
          console.error('Failed to process referral:', e);
        }
      }
    };

    const timer = setTimeout(() => {
      handleReferral();
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

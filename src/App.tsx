
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

// Создаем инстанс QueryClient с настройками повторных попыток
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

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
            console.log('Processing referral for user:', currentUser.id, 'from referrer:', decodedData.referrer);
            
            // Проверяем, не является ли пользователь уже чьим-то рефералом
            const { data: existingReferral, error: referralError } = await supabase
              .from('referrals')
              .select('*')
              .eq('referee_id', currentUser.id)
              .single();

            if (referralError && referralError.code !== 'PGRST116') {
              console.error('Error checking existing referral:', referralError);
            }

            if (!existingReferral) {
              console.log('Creating new referral record');
              const { error: insertError } = await supabase
                .from('referrals')
                .insert({
                  referrer_id: decodedData.referrer,
                  referee_id: currentUser.id
                });
              
              if (insertError) {
                console.error('Error creating referral:', insertError);
              }
            } else {
              console.log('User already has a referrer');
            }

            // Записываем клик в любом случае
            console.log('Recording referral click');
            const { error: clickError } = await supabase
              .from('referral_clicks')
              .insert({
                referrer_id: decodedData.referrer
              });
            
            if (clickError) {
              console.error('Error recording click:', clickError);
            }
          }
        } catch (e) {
          console.error('Failed to process referral:', e);
        }
      }
    };

    const timer = setTimeout(() => {
      handleReferral().finally(() => {
        setIsLoading(false);
      });
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

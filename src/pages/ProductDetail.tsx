import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import confetti from 'canvas-confetti';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAddToCart = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFFFFF', '#9B7E3B'],
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1F2C] text-[#1A1F2C] dark:text-white">
      <Header />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <div className="bg-gray-100 dark:bg-[#2A2F3C] rounded-xl p-4">
          <div className="relative mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full text-[#9B7E3B] hover:text-[#B19548] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
              alt="Delivery Frame"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-xl font-semibold mb-2">Шоколадное печенье</h1>
          <span className="inline-block text-[#9B7E3B] text-sm mb-3">PREMIUM</span>
          
          <p className="text-gray-400 mb-6">
            Наше фирменное шоколадное печенье готовится по традиционному рецепту с использованием только натуральных ингредиентов высшего качества. Каждое печенье выпекается вручную для достижения идеального вкуса и текстуры.
          </p>

          <h2 className="text-lg font-medium mb-3">Состав</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
            <li>Мука высшего сорта</li>
            <li>Натуральное сливочное масло</li>
            <li>Свежие яйца</li>
            <li>Тростниковый сахар</li>
            <li>Бельгийский шоколад премиум-класса</li>
          </ul>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-semibold">2000 ₽</span>
          </div>

          <Button 
            onClick={handleAddToCart}
            className="w-full bg-[#9B7E3B] hover:bg-[#B19548] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Добавить в корзину
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;

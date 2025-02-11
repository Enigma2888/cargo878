
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
      colors: ['#FFFFFF', '#9B7E3B'], // White and gold colors
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Header />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-[#9B7E3B] hover:text-[#B19548] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>

        <div className="bg-[#2A2F3C] rounded-xl p-4">
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <img 
              src="/lovable-uploads/6df51440-de8e-4d5d-bfa9-53378df4b628.png" 
              alt="Cookie"
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

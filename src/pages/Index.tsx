
import { Header } from "@/components/Header";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const Index = () => {
  return <div className="min-h-screen bg-[#1A1F2C] text-white">
      <Header />
      <main className="pt-20 px-4 max-w-md mx-auto">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extralight">Товары</h2>
            <button className="text-[#9B7E3B] text-sm">листай</button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2A2F3C] rounded-xl p-3">
                      <Link to={`/product/${index + 1}`}>
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 transition-transform duration-200 hover:scale-105">
                          <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" alt="Delivery Frame 1" className="w-full h-full object-cover" />
                        </div>
                      </Link>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium mb-1">Шоколадное</h3>
                          <span className="text-[#9B7E3B] text-xs">PREMIUM</span>
                          <p className="text-sm mt-1">2000 ₽</p>
                        </div>
                        <Link to={`/product/${index + 1}`} className="mt-1 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/20">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    <div className="bg-[#2A2F3C] rounded-xl p-3">
                      <Link to={`/product/${index + 6}`}>
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 transition-transform duration-200 hover:scale-105">
                          <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" alt="Delivery Frame 2" className="w-full h-full object-cover rounded-none" />
                        </div>
                      </Link>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium mb-1">С изюмом</h3>
                          <span className="text-[#9B7E3B] text-xs">PREMIUM</span>
                          <p className="text-sm mt-1">1600 ₽</p>
                        </div>
                        <Link to={`/product/${index + 6}`} className="mt-1 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/20">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-extralight">Услуги</h2>
            <button className="text-[#9B7E3B] text-sm">листай</button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="bg-[#2A2F3C] rounded-xl p-3">
                    <Link to={`/product/service-${index + 1}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" alt={`Service ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Double Chocolate</h3>
                          <span className="text-[#9B7E3B] text-xs">PREMIUM</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 line-through text-sm">2000 ₽</span>
                            <span className="text-sm">1200 ₽</span>
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-full p-1">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>
    </div>;
};

export default Index;


import { Header } from "@/components/Header";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  page_title: string;
  page_description: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  page_title: string;
  page_description: string;
}

const Index = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) throw error;
      return data as Product[];
    }
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      if (error) throw error;
      return data as Service[];
    }
  });

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
            {!isLoadingProducts && products && Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-full">
                <div className="grid grid-cols-2 gap-4">
                  {products.slice(index * 2, index * 2 + 2).map((product) => (
                    <div key={product.id} className="bg-[#2A2F3C] rounded-xl p-3">
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 transition-transform duration-200 hover:scale-105">
                          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                      </Link>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium mb-1">{product.title}</h3>
                          <span className="text-[#9B7E3B] text-xs">{product.category}</span>
                          <p className="text-sm mt-1">{product.price} ₽</p>
                        </div>
                        <Link to={`/product/${product.id}`} className="mt-1 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/20">
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
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
            {!isLoadingServices && services && services.map((service) => (
              <CarouselItem key={service.id} className="md:basis-full">
                <div className="bg-[#2A2F3C] rounded-xl p-3">
                  <Link to={`/product/service-${service.id}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{service.title}</h3>
                        <span className="text-[#9B7E3B] text-xs">{service.category}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {service.original_price && (
                            <span className="text-gray-400 line-through text-sm">{service.original_price} ₽</span>
                          )}
                          <span className="text-sm">{service.price} ₽</span>
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


import { useParams } from "react-router-dom";
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

const ProductDetail = () => {
  const { id } = useParams();
  const isService = id?.startsWith('service-');
  const actualId = isService ? id.replace('service-', '') : id;

  const { data: item, isLoading } = useQuery({
    queryKey: [isService ? 'service' : 'product', actualId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(isService ? 'services' : 'products')
        .select('*')
        .eq('id', actualId)
        .single();
      
      if (error) throw error;
      return data as Product | Service;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="mb-8">
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-64 object-cover rounded-xl"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{item.page_title || item.title}</h1>
        <p className="text-gray-400 mb-4">{item.page_description || item.description}</p>
        
        <div className="flex items-center justify-between bg-[#2A2F3C] p-4 rounded-xl">
          <div>
            <span className="text-[#9B7E3B] text-sm">{item.category}</span>
            <div className="flex items-center gap-2 mt-1">
              {'original_price' in item && item.original_price && (
                <span className="text-gray-400 line-through">{item.original_price} ₽</span>
              )}
              <span className="text-xl font-bold">{item.price} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

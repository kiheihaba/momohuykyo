
import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, ShoppingBag, Bot, Palette } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesProps {
  onOpenMerch: () => void;
  onOpenServices: () => void;
  onViewAllProjects: () => void;
}

const services: ServiceItem[] = [
  {
    id: 1,
    title: "Digital Content",
    description: "Kênh giải trí & giáo dục triệu view, mang lại kiến thức thực chiến và cảm hứng sống.",
    icon: "content",
    image: "https://postimg.cc/hhYzGdwP" 
  },
  {
    id: 2,
    title: "Momo x HuyKyo Merch",
    description: "Thời trang & Vật phẩm phong thủy thiết kế độc quyền, đậm chất Cyberpunk.",
    icon: "merch",
    image: "https://i.postimg.cc/vZjfYJFB/Google-AI-Studio-2026-01-24T20-57-45-139Z.png"
  },
  {
    id: 3,
    title: "Dịch Vụ",
    description: "Cung cấp các sản phẩm số, template Notion và ứng dụng công nghệ tối ưu hóa công việc.",
    icon: "ai",
    image: "https://i.postimg.cc/FFDfFM01/Google-AI-Studio-2026-01-24T20-58-32-603Z.png"
  },
  {
    id: 4,
    title: "Creative Art",
    description: "Sáng tạo nghệ thuật số không giới hạn với sự hỗ trợ của Generative AI.",
    icon: "art",
    image: "https://i.postimg.cc/TYspgn7T/Gemini-Generated-Image-bsnchxbsnchxbsnc.png"
  }
];

const Services: React.FC<ServicesProps> = ({ onOpenMerch, onOpenServices, onViewAllProjects }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'content': return <MonitorPlay size={24} />;
      case 'merch': return <ShoppingBag size={24} />;
      case 'ai': return <Bot size={24} />;
      case 'art': return <Palette size={24} />;
      default: return <MonitorPlay size={24} />;
    }
  };

  const handleDetailsClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (id === 2) { // Momo x HuyKyo Merch
      onOpenMerch();
    } else if (id === 3) { // Dịch Vụ
      onOpenServices();
    }
  };

  return (
    <section id="ecosystem" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-brand-cyan font-bold tracking-wider uppercase mb-2 text-sm">Hệ sinh thái</h2>
            <h3 className="text-4xl font-bold text-white leading-tight uppercase">
              SẢN PHẨM VÀ DỊCH VỤ
            </h3>
          </div>
          <button 
            onClick={onViewAllProjects}
            className="hidden md:block text-white border-b border-brand-cyan pb-1 hover:text-brand-cyan transition-colors mt-4 md:mt-0"
          >
            Xem tất cả dự án
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-xl border border-gray-800 bg-black cursor-pointer"
              onClick={(e) => handleDetailsClick(e, service.id)}
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                 <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/121212/00FFFF?text=Momo+x+HuyKyo'; // Fallback
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="w-12 h-12 bg-brand-cyan/10 backdrop-blur-md rounded-lg flex items-center justify-center text-brand-cyan mb-4 border border-brand-cyan/30">
                  {getIcon(service.icon)}
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
                  {service.title}
                </h4>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {service.description}
                </p>
                
                <button 
                  onClick={(e) => handleDetailsClick(e, service.id)}
                  className="inline-flex items-center text-xs font-bold text-white uppercase tracking-wider hover:text-brand-cyan transition-colors"
                >
                  Chi tiết <span className="ml-2 text-brand-cyan">&rarr;</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
         {/* Mobile Button */}
         <div className="mt-8 text-center md:hidden">
            <button 
                onClick={onViewAllProjects}
                className="text-white border-b border-brand-cyan pb-1 hover:text-brand-cyan transition-colors"
            >
                Xem tất cả dự án
            </button>
         </div>
      </div>
    </section>
  );
};

export default Services;

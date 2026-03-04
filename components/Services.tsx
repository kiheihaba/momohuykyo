
import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, ShoppingBag, Bot, Palette, ArrowRight } from 'lucide-react';
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
    <section id="ecosystem" className="py-24 bg-brand-dark bg-noise relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brand-cyan font-bold tracking-widest uppercase mb-2 text-sm"
            >
              Hệ sinh thái
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white leading-tight uppercase drop-shadow-lg"
            >
              SẢN PHẨM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">&</span> DỊCH VỤ
            </motion.h3>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={onViewAllProjects}
            className="hidden md:block px-6 py-2 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan hover:text-brand-black transition-all duration-300 uppercase text-sm font-bold tracking-wider clip-path-slant"
          >
            Xem tất cả dự án
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm cursor-pointer hover:border-brand-cyan/50 transition-colors duration-500"
              onClick={(e) => handleDetailsClick(e, service.id)}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                 <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/121212/00FFFF?text=Momo+x+HuyKyo'; // Fallback
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                <div className="mb-auto transform translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <div className="w-12 h-12 bg-brand-cyan text-brand-black rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                    {getIcon(service.icon)}
                  </div>
                </div>

                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors uppercase tracking-tight">
                    {service.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {service.description}
                  </p>
                  
                  <div className="w-full h-[1px] bg-white/10 mb-4 group-hover:bg-brand-cyan/30 transition-colors"></div>

                  <button 
                    onClick={(e) => handleDetailsClick(e, service.id)}
                    className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest hover:text-brand-cyan transition-colors group/btn"
                  >
                    Chi tiết <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
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

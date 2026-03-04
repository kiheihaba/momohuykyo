import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TestimonialItem } from '../types';

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Minh Anh",
    role: "Content Creator",
    content: "Momo x HuyKyo thực sự đã thay đổi cách tôi nhìn nhận về kỷ luật. Các giải pháp AI giúp tôi tiết kiệm 50% thời gian làm việc.",
    image: "https://i.postimg.cc/x8C1bdMW/Google-AI-Studio-2026-01-24T21-01-27-221Z.png"
  },
  {
    id: 2,
    name: "Hoàng Nam",
    role: "Freelancer",
    content: "Phong cách thiết kế và tư duy của team rất khác biệt. Một nguồn cảm hứng lớn cho cộng đồng Solopreneur Việt Nam.",
    image: "https://i.postimg.cc/WpW3cMPv/Google-AI-Studio-2026-01-24T21-01-45-411Z.png"
  },
  {
    id: 3,
    name: "Lan Chi",
    role: "Gen Z Entrepreneur",
    content: "Sản phẩm chất lượng, cộng đồng văn minh. Tôi đã học được rất nhiều về cách ứng dụng công nghệ vào kinh doanh cá nhân.",
    image: "https://i.postimg.cc/wT1Bq764/Google-AI-Studio-2026-01-24T21-01-51-731Z.png"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-brand-cyan font-bold tracking-widest uppercase mb-16 text-sm flex items-center justify-center gap-2"
        >
          <span className="w-8 h-[1px] bg-brand-cyan"></span>
          Cộng đồng nói gì
          <span className="w-8 h-[1px] bg-brand-cyan"></span>
        </motion.h2>
        
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="glass-panel p-10 md:p-16 rounded-3xl relative mx-4 md:mx-0 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            >
              <Quote className="absolute top-8 left-8 text-brand-cyan w-12 h-12 opacity-20" />
              <Quote className="absolute bottom-8 right-8 text-brand-cyan w-12 h-12 opacity-20 rotate-180" />
              
              <p className="text-xl md:text-3xl text-white font-light italic mb-10 relative z-10 leading-relaxed drop-shadow-md">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-cyan blur-md opacity-50 rounded-full"></div>
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name} 
                    className="w-20 h-20 rounded-full border-2 border-brand-cyan object-cover relative z-10"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-white font-bold text-xl uppercase tracking-wide">{testimonials[currentIndex].name}</h4>
                  <p className="text-brand-cyan text-xs uppercase tracking-widest font-bold mt-1">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center mt-12 gap-6">
            <button 
              onClick={prev} 
              className="group p-4 rounded-full border border-white/10 hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all duration-300"
            >
              <ChevronLeft size={24} className="text-gray-400 group-hover:text-brand-cyan transition-colors" />
            </button>
            <button 
              onClick={next} 
              className="group p-4 rounded-full border border-white/10 hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all duration-300"
            >
              <ChevronRight size={24} className="text-gray-400 group-hover:text-brand-cyan transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
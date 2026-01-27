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
    <section className="py-24 bg-black border-t border-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-brand-cyan font-bold tracking-wider uppercase mb-16 text-sm">Cộng đồng nói gì</h2>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-[#121212] p-10 md:p-14 rounded-2xl relative border border-gray-800 mx-4 md:mx-0"
            >
              <Quote className="absolute top-8 left-8 text-gray-700 w-12 h-12 opacity-50" />
              
              <p className="text-xl md:text-2xl text-gray-200 font-light italic mb-8 relative z-10">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name} 
                  className="w-16 h-16 rounded-full border-2 border-brand-cyan object-cover"
                />
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-brand-cyan text-sm uppercase tracking-wide">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button onClick={prev} className="p-3 rounded-full bg-gray-900 text-white hover:bg-brand-cyan hover:text-black transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-3 rounded-full bg-gray-900 text-white hover:bg-brand-cyan hover:text-black transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
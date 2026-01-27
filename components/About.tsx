import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-cyan font-bold tracking-wider uppercase mb-2 text-sm">Về chúng tôi</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Biểu tượng của <br/> tư duy làm chủ
            </h3>
            <div className="h-1 w-20 bg-brand-cyan mb-8"></div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              <span className="text-white font-semibold">Momo x HuyKyo</span> không chỉ là một thương hiệu, mà là biểu tượng của tư duy làm chủ và sự kỷ luật. Chúng tôi tin rằng công nghệ không thay thế con người, mà là đòn bẩy để con người vươn xa hơn.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Chúng tôi ứng dụng <span className="text-brand-cyan">Trí tuệ nhân tạo (AI)</span> để tối ưu hóa mọi quy trình sản xuất, từ sáng tạo nội dung đến vận hành thương mại điện tử, mang lại giá trị thực tiễn và tốc độ đột phá.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-gray-800 pt-8">
               <div>
                  <h4 className="text-3xl font-bold text-white mb-1">100K+</h4>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">Followers Gen Z</p>
               </div>
               <div>
                  <h4 className="text-3xl font-bold text-white mb-1">24/7</h4>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">AI Vận hành</p>
               </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-brand-cyan/20 z-0 translate-x-4 translate-y-4"></div>
            <div className="relative z-10 h-[500px] w-full bg-gray-800 overflow-hidden">
                {/* Founder Image */}
                <img 
                  src="https://i.postimg.cc/DfNcypVw/Avatar-Huy-Kyo.jpg" 
                  alt="HuyKyo - Founder" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                   <p className="text-white font-bold text-xl">HuyKyo</p>
                   <p className="text-brand-cyan text-sm">Founder</p>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
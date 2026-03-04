import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-brand-dark bg-noise relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -left-20 top-20 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-brand-cyan font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-[1px] bg-brand-cyan"></span>
              Về chúng tôi
            </h2>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight uppercase">
              Biểu tượng của <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">tư duy làm chủ</span>
            </h3>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              <span className="text-white font-bold">Momo x HuyKyo</span> không chỉ là một thương hiệu, mà là biểu tượng của tư duy làm chủ và sự kỷ luật. Chúng tôi tin rằng công nghệ không thay thế con người, mà là đòn bẩy để con người vươn xa hơn.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Chúng tôi ứng dụng <span className="text-brand-cyan font-semibold">Trí tuệ nhân tạo (AI)</span> để tối ưu hóa mọi quy trình sản xuất, từ sáng tạo nội dung đến vận hành thương mại điện tử, mang lại giá trị thực tiễn và tốc độ đột phá.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div className="group">
                  <h4 className="text-4xl font-black text-white mb-1 group-hover:text-brand-cyan transition-colors duration-300">100K+</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">Followers Gen Z</p>
               </div>
               <div className="group">
                  <h4 className="text-4xl font-black text-white mb-1 group-hover:text-brand-cyan transition-colors duration-300">24/7</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">AI Vận hành</p>
               </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-4 border border-brand-cyan/20 z-0 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="absolute -inset-4 border border-white/5 z-0 -translate-x-4 -translate-y-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>
            
            <div className="relative z-10 h-[600px] w-full bg-gray-900 overflow-hidden clip-path-slant grayscale group-hover:grayscale-0 transition-all duration-700">
                {/* Founder Image */}
                <img 
                  src="https://i.postimg.cc/DfNcypVw/Avatar-Huy-Kyo.jpg" 
                  alt="HuyKyo - Founder" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                   <div className="flex items-end gap-4">
                      <div className="w-1 h-12 bg-brand-cyan"></div>
                      <div>
                        <p className="text-white font-black text-3xl uppercase tracking-tighter leading-none mb-1">HuyKyo</p>
                        <p className="text-brand-cyan text-sm font-bold tracking-widest uppercase">Founder</p>
                      </div>
                   </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
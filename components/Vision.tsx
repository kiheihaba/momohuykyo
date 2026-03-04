import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Cpu } from 'lucide-react';

const cards = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Sứ mệnh",
    desc: "Truyền cảm hứng sống kỷ luật và tư duy làm chủ cho thế hệ trẻ."
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Tầm nhìn",
    desc: "Định hình tương lai của Solopreneur với sức mạnh tối ưu của AI."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Giá trị",
    desc: "Sáng tạo không ngừng - Tốc độ vượt trội - Hiệu quả tối đa."
  }
];

const Vision: React.FC = () => {
  return (
    <section id="vision" className="py-24 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-cyan/5 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6"
          >
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">Values</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-lg"
          >
            Những nguyên tắc cốt lõi định hình nên sự phát triển bền vững của Momo x HuyKyo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-[#0f0f0f] p-8 border border-white/5 hover:border-brand-cyan/50 transition-all duration-500 group hover:-translate-y-2 overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-brand-cyan transition-colors"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-brand-cyan transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-brand-cyan transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-brand-cyan transition-colors"></div>

              <div className="w-16 h-16 bg-brand-cyan/10 rounded-none mb-8 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 border border-brand-cyan/20 group-hover:border-brand-cyan group-hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <div className="text-brand-cyan">
                  {card.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide group-hover:text-brand-cyan transition-colors">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vision;
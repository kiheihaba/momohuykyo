import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Cpu } from 'lucide-react';

const cards = [
  {
    icon: <Target className="w-10 h-10 text-brand-black" />,
    title: "Sứ mệnh",
    desc: "Truyền cảm hứng sống kỷ luật và tư duy làm chủ cho thế hệ trẻ."
  },
  {
    icon: <Cpu className="w-10 h-10 text-brand-black" />,
    title: "Tầm nhìn",
    desc: "Định hình tương lai của Solopreneur với sức mạnh tối ưu của AI."
  },
  {
    icon: <Zap className="w-10 h-10 text-brand-black" />,
    title: "Giá trị",
    desc: "Sáng tạo không ngừng - Tốc độ vượt trội - Hiệu quả tối đa."
  }
];

const Vision: React.FC = () => {
  return (
    <section id="vision" className="py-24 bg-black relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Core <span className="text-brand-cyan">Values</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Những nguyên tắc cốt lõi định hình nên sự phát triển bền vững của Momo x HuyKyo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-[#1a1a1a] p-8 border border-gray-800 hover:border-brand-cyan transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-brand-cyan rounded-none mb-6 flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300">
                <div className="transform group-hover:-rotate-45 transition-transform duration-300">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
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
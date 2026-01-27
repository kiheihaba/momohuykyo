import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Glitch animation variants
  const glitchVariants = {
    hidden: { x: 0, y: 0, opacity: 1 },
    visible: {
      x: [0, -2, 2, -2, 0],
      y: [0, 1, -1, 1, 0],
      textShadow: [
        "0px 0px 0px rgba(0,255,255,0)",
        "-2px 0px 0px rgba(255,0,0,0.7), 2px 0px 0px rgba(0,255,255,0.7)",
        "2px 0px 0px rgba(255,0,0,0.7), -2px 0px 0px rgba(0,255,255,0.7)",
        "0px 0px 0px rgba(0,255,255,0)"
      ],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatType: "mirror" as const
      }
    }
  };

  const handleScrollToEcosystem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('ecosystem');
    if (element) {
      const headerOffset = 80; // Chiều cao của fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://i.postimg.cc/nLjKqHYg/Google-AI-Studio-2026-01-24T20-56-54-627Z.png" 
            alt="Momo x HuyKyo Cover" 
            className="w-full h-full object-cover opacity-50"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/50 to-brand-black"></div>
      </div>

      {/* Abstract Background Grid (Overlaying image slightly for texture) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            Future of Solopreneur
          </span>
          
          <div 
            className="relative cursor-default"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
             <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-tight select-none drop-shadow-2xl"
                animate={isHovered ? "visible" : "hidden"}
                variants={glitchVariants}
             >
                Tiên phong Kỷ nguyên <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-cyan to-white">
                    Nội dung số & AI
                </span>
             </motion.h1>
          </div>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 font-light mb-10 drop-shadow-md">
            Hệ sinh thái đa dạng từ giải trí, giáo dục đến thời trang phong cách sống dành cho <span className="text-white font-semibold">Gen Z</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#ecosystem" 
              onClick={handleScrollToEcosystem}
              className="group relative px-8 py-4 bg-transparent border border-brand-cyan text-brand-cyan font-bold uppercase tracking-wider overflow-hidden backdrop-blur-sm hover:bg-brand-cyan/10 transition-colors cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-brand-cyan/10 transform -translate-x-full skew-x-12 transition-transform duration-300 group-hover:translate-x-0"></span>
              <span className="relative flex items-center gap-2">
                Khám phá Hệ sinh thái <ArrowRight size={20} />
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-brand-cyan to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
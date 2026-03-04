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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-black bg-noise">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-cyan/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://i.postimg.cc/nLjKqHYg/Google-AI-Studio-2026-01-24T20-56-54-627Z.png" 
            alt="Momo x HuyKyo Cover" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/60 to-brand-black"></div>
      </div>

      {/* Abstract Background Grid */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-brand-cyan text-xs font-bold tracking-[0.2em] uppercase mb-8 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            Future of Solopreneur
          </motion.div>
          
          <div 
            className="relative cursor-default perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
             <motion.h1 
                className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-6 leading-none select-none drop-shadow-2xl"
                animate={isHovered ? "visible" : "hidden"}
                variants={glitchVariants}
             >
                Tiên phong <br />
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-purple-500 blur-2xl opacity-30"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-cyan to-white bg-[length:200%_auto] animate-shimmer">
                      Nội dung số & AI
                  </span>
                </span>
             </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-light mb-12 leading-relaxed"
          >
            Hệ sinh thái đa dạng từ giải trí, giáo dục đến thời trang phong cách sống dành cho <span className="text-white font-semibold border-b border-brand-cyan/50">Gen Z</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <a 
              href="#ecosystem" 
              onClick={handleScrollToEcosystem}
              className="group relative px-8 py-4 bg-brand-cyan text-brand-black font-bold uppercase tracking-wider overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300 clip-path-slant"
            >
              <span className="relative flex items-center gap-2 z-10">
                Khám phá Hệ sinh thái <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            
            <a 
              href="#vision"
              className="px-8 py-4 text-white font-bold uppercase tracking-wider hover:text-brand-cyan transition-colors relative group"
            >
              <span className="relative z-10">Tìm hiểu thêm</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-cyan transition-all duration-300 group-hover:w-full"></span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-cyan/0 via-brand-cyan to-brand-cyan/0"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
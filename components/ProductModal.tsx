import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Ruler, Info, Truck } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      // In a real app, this would add to cart state
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-[#1a1a1a] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto md:overflow-hidden bg-noise"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-brand-cyan hover:text-black rounded-full text-white transition-all duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-[#050505] relative group overflow-hidden flex items-center justify-center p-10 border-r border-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/10 via-transparent to-transparent opacity-50"></div>
            
            {/* Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-cyan/20 blur-[80px] rounded-full pointer-events-none"></div>

            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-contain max-h-[500px] z-10 drop-shadow-[0_0_30px_rgba(0,255,255,0.2)] group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-10 flex flex-col h-full overflow-y-auto custom-scrollbar bg-[#121212]/90 backdrop-blur-sm">
            {product.badge && (
               <motion.span 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="inline-block w-max px-4 py-1 bg-brand-cyan text-black text-xs font-black uppercase tracking-widest mb-6 clip-path-slant shadow-[0_0_10px_#00FFFF]"
               >
                 {product.badge}
               </motion.span>
            )}
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-white uppercase mb-4 leading-none tracking-tight"
            >
              {product.name}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-brand-cyan mb-8 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            >
              {product.price.toLocaleString('vi-VN')} VNĐ
            </motion.p>

            <div className="space-y-8 mb-10 flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="flex items-center gap-2 text-white font-bold uppercase text-sm mb-3 tracking-wider">
                  <Info size={16} className="text-brand-cyan" /> Câu chuyện thiết kế
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-brand-cyan/30 pl-4">
                  "{product.story}"
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="flex items-center gap-2 text-white font-bold uppercase text-sm mb-3 tracking-wider">
                  <Ruler size={16} className="text-brand-cyan" /> Size Chart thông minh
                </h4>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-brand-cyan/30 transition-colors">
                  {product.fitGuide}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                 <h4 className="text-white font-bold uppercase text-sm mb-2 tracking-wider">Chất liệu</h4>
                 <p className="text-gray-400 text-sm">{product.material}</p>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-8 border-t border-white/10 mt-auto"
            >
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full relative group overflow-hidden bg-white text-black font-black py-5 px-6 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-cyan transition-all duration-300 clip-path-slant hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
              >
                {isAdding ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                    <span>Đang thêm vào giỏ...</span>
                  </>
                ) : (
                  <>
                    <span>Thêm vào giỏ</span>
                    <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                
                {/* Particle Effect Sim (CSS) */}
                {isAdding && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-brand-cyan rounded-full animate-ping"></div>
                  </div>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
                <Truck size={14} className="text-brand-cyan" />
                <span>Giao hàng toàn quốc 2-4 ngày</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
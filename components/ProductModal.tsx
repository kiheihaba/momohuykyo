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
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-[#1a1a1a] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto md:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-brand-cyan hover:text-black rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-[#000] relative group overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-50"></div>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-contain max-h-[400px] z-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
            {product.badge && (
               <span className="inline-block w-max px-3 py-1 bg-brand-cyan text-black text-xs font-bold uppercase tracking-wider mb-4">
                 {product.badge}
               </span>
            )}
            
            <h2 className="text-3xl font-black text-white uppercase mb-2 leading-none">{product.name}</h2>
            <p className="text-2xl font-bold text-brand-cyan mb-6">
              {product.price.toLocaleString('vi-VN')} VNĐ
            </p>

            <div className="space-y-6 mb-8 flex-grow">
              <div>
                <h4 className="flex items-center gap-2 text-white font-bold uppercase text-sm mb-2">
                  <Info size={16} className="text-gray-400" /> Câu chuyện thiết kế
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "{product.story}"
                </p>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-white font-bold uppercase text-sm mb-2">
                  <Ruler size={16} className="text-gray-400" /> Size Chart thông minh
                </h4>
                <div className="bg-gray-900 p-3 rounded border border-gray-800 text-gray-300 text-sm">
                  {product.fitGuide}
                </div>
              </div>

              <div>
                 <h4 className="text-white font-bold uppercase text-sm mb-1">Chất liệu</h4>
                 <p className="text-gray-400 text-sm">{product.material}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-800 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 px-6 uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-brand-cyan transition-colors"
              >
                {isAdding ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                    <span>Đang thêm vào giỏ...</span>
                  </>
                ) : (
                  <>
                    <span>Thêm vào giỏ</span>
                    <ShoppingCart size={20} />
                  </>
                )}
                
                {/* Particle Effect Sim (CSS) */}
                {isAdding && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-brand-cyan rounded-full animate-ping"></div>
                  </div>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Truck size={14} />
                <span>Giao hàng toàn quốc 2-4 ngày</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
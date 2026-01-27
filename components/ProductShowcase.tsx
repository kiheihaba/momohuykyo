import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import ProductModal from './ProductModal';

const products: Product[] = [
  {
    id: 1,
    name: "Capy-Tech Oversized Tee",
    price: 350000,
    image: "https://i.postimg.cc/TYspgn7T/Gemini-Generated-Image-bsnchxbsnchxbsnc.png",
    badge: "Limited Edition",
    description: "Biểu tượng của sự bình thản giữa kỷ nguyên số hỗn loạn.",
    story: "Lấy cảm hứng từ những Solopreneur thức dậy lúc 2h sáng nhưng vẫn giữ tâm thái bình tĩnh như Capybara. Thiết kế kết hợp giữa Cyberpunk và văn hóa Meme.",
    material: "100% Premium Cotton 250gsm - Dày dặn, thoáng mát, không xù lông.",
    fitGuide: "Fit đẹp nhất cho người 1m59 - 65kg (Size M) | 1m75 - 80kg (Size L)"
  },
  {
    id: 2,
    name: "AI Architect Hoodie",
    price: 650000,
    image: "https://i.postimg.cc/3x862bRR/Google-AI-Studio-2026-01-24T22-28-42-963Z.png",
    badge: "Pre-order",
    description: "Áo Hoodie form rộng với hoạ tiết mạch điện tử phát quang.",
    story: "Dành cho những kiến trúc sư của thế giới số. Giữ ấm cơ thể trong những đêm code thâu đêm suốt sáng.",
    material: "Nỉ bông chân cua cao cấp, định lượng 350gsm.",
    fitGuide: "Oversized Fit. Size L phù hợp cho cả nam và nữ dưới 1m80."
  },
  {
    id: 3,
    name: "System Failure Tote",
    price: 150000,
    image: "https://i.postimg.cc/FHT6pgdy/Google-AI-Studio-2026-01-24T22-29-13-588Z.png",
    description: "Túi Tote vải Canvas đen tuyền in lỗi Glitch.",
    story: "Đôi khi hệ thống cần sập để tái khởi động mạnh mẽ hơn. Một lời nhắc nhở về sự kiên cường.",
    material: "Canvas mộc dày dặn, quai đeo chắc chắn chịu lực 10kg.",
    fitGuide: "Kích thước 40x40cm, vừa laptop 15 inch."
  },
  {
    id: 4,
    name: "Momo Signature Cap",
    price: 250000,
    image: "https://i.postimg.cc/MGXFFM1S/Extreme-closeup-shot-2k-202601250532.jpg",
    description: "Mũ lưỡi trai thêu logo 3D nổi bật.",
    story: "Phụ kiện không thể thiếu cho những ngày Bad Hair Day nhưng vẫn phải ra đường gặp đối tác.",
    material: "Kaki nhung cao cấp, khóa kim loại chống rỉ.",
    fitGuide: "Freesize, có khóa điều chỉnh phía sau."
  }
];

interface ProductShowcaseProps {
  onBack: () => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Hero Product (The first one)
  const heroProduct = products[0];
  // Other products
  const gridProducts = products.slice(1);

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest"
        >
          <ArrowLeft size={20} /> Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white">
          MERCH <span className="text-brand-cyan">STORE</span>
        </div>
        <div className="relative p-2">
            <ShoppingBag className="text-white hover:text-brand-cyan cursor-pointer" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-brand-cyan text-black text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-10">
        
        {/* Hero Collection */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative group cursor-pointer" onClick={() => setSelectedProduct(heroProduct)}>
              {/* Spotlight Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-cyan/20 blur-[100px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
              
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <img 
                  src={heroProduct.image} 
                  alt={heroProduct.name}
                  className="w-full h-auto object-cover rounded-lg shadow-2xl drop-shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                />
                {heroProduct.badge && (
                  <div className="absolute top-4 left-4 bg-brand-cyan text-black font-black uppercase px-4 py-2 text-sm tracking-widest shadow-[0_0_10px_#00FFFF]">
                    {heroProduct.badge}
                  </div>
                )}
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-4 leading-none">
                {heroProduct.name}
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-lg">
                {heroProduct.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-6">
                 <span className="text-3xl font-bold text-brand-cyan">
                   {heroProduct.price.toLocaleString('vi-VN')} đ
                 </span>
                 <button 
                    onClick={() => setSelectedProduct(heroProduct)}
                    className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-brand-cyan transition-colors clip-path-slant"
                 >
                    Xem chi tiết
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <h2 className="text-2xl font-bold text-white uppercase mb-8 border-l-4 border-brand-cyan pl-4">
          Bộ sưu tập khác
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {gridProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1a1a1a] border border-gray-800 group hover:border-brand-cyan/50 transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[3/4] cursor-pointer" onClick={() => setSelectedProduct(product)}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {product.badge && (
                  <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-2 py-1 uppercase border border-white/20">
                    {product.badge}
                  </div>
                )}
                {/* Add to Cart overlay on mobile/desktop */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 backdrop-blur-sm flex justify-center">
                    <span className="text-brand-cyan text-sm font-bold uppercase">Xem nhanh</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-white uppercase mb-1 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-brand-cyan font-semibold">
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="p-2 bg-gray-800 text-white rounded-full hover:bg-brand-cyan hover:text-black transition-colors"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};

export default ProductShowcase;
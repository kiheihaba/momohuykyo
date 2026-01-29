
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Home,
  Trees, // Changed from TreePine to Trees for better compatibility
  Wheat,
  Key,
  Ruler,
  CheckCircle2,
  Camera,
  Plus
} from 'lucide-react';

interface RealEstatePageProps {
  onBack: () => void;
}

interface PropertyItem {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  type: string;
  image: string;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  contact: string;
}

// Danh mục BĐS
const categories = [
  { id: "all", name: "Tất cả", icon: <Home size={16} /> },
  { id: "Nhà ở", name: "Nhà ở", icon: <Home size={16} /> },
  { id: "Đất nền", name: "Đất nền", icon: <Trees size={16} /> },
  { id: "Nông nghiệp", name: "Đất ruộng/Vườn", icon: <Wheat size={16} /> },
  { id: "Cho thuê", name: "Cho thuê", icon: <Key size={16} /> },
];

// Dữ liệu mẫu
const MOCK_PROPERTIES: PropertyItem[] = [
  {
    id: "1",
    title: "Đất vườn mặt tiền lộ nhựa 8m",
    price: "1.2 Tỷ",
    area: "1000m²",
    location: "Ấp 3, Thạnh Lợi",
    type: "Đất nền",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    isVerified: true,
    isFeatured: true,
    isNew: true,
    contact: "0901234567"
  },
  {
    id: "2",
    title: "Nhà cấp 4 mới xây gần chợ",
    price: "850 Triệu",
    area: "120m²",
    location: "Chợ Thạnh Lợi",
    type: "Nhà ở",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=800",
    isVerified: true,
    isFeatured: false,
    isNew: true,
    contact: "0912345678"
  },
  {
    id: "3",
    title: "5 công đất ruộng đang làm lúa",
    price: "150 Triệu/công",
    area: "5000m²",
    location: "Kênh Xáng",
    type: "Nông nghiệp",
    image: "https://images.unsplash.com/photo-1605112181045-31627b0b304c?auto=format&fit=crop&q=80&w=800",
    isVerified: false,
    isFeatured: false,
    isNew: false,
    contact: "0923456789"
  },
  {
    id: "4",
    title: "Cho thuê nhà nguyên căn mặt tiền",
    price: "3 Triệu/tháng",
    area: "80m²",
    location: "Ngã 4 Thạnh Lợi",
    type: "Cho thuê",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
    isVerified: true,
    isFeatured: false,
    isNew: false,
    contact: "0934567890"
  },
  {
    id: "5",
    title: "Đất thổ cư giá ngộp cần ra gấp",
    price: "550 Triệu",
    area: "100m²",
    location: "Ấp 4",
    type: "Đất nền",
    image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&q=80&w=800",
    isVerified: false,
    isFeatured: false,
    isNew: true,
    contact: "0945678901"
  }
];

const RealEstatePage: React.FC<RealEstatePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<PropertyItem[]>(MOCK_PROPERTIES);

  const filteredProperties = properties.filter(item => {
    const matchesCategory = activeCategory === "all" || item.type === activeCategory || (activeCategory === "Cho thuê" && item.type === "Cho thuê");
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProperties = properties.filter(p => p.isFeatured);

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-900 font-sans">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900 flex items-center gap-2">
                Nhà Đất Thạnh Lợi <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Verified</span>
            </h1>
            <p className="text-xs text-gray-500">Mua bán chính chủ - Không lo cò mồi</p>
        </div>
      </div>

      {/* 2. FEATURED SLIDER (Tin Nổi Bật) */}
      {featuredProperties.length > 0 && (
          <div className="bg-white pt-4 pb-2 px-4">
              <h2 className="text-sm font-bold text-gray-900 uppercase mb-3 flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-blue-500" /> Tin Nổi Bật
              </h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {featuredProperties.map(item => (
                      <div key={item.id} className="min-w-[280px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md relative">
                          <div className="h-40 relative">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                  HOT
                              </span>
                          </div>
                          <div className="p-3">
                              <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                              <p className="text-red-600 font-extrabold text-lg mt-1">{item.price}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                                  <span className="flex items-center gap-1"><Ruler size={12}/> {item.area}</span>
                                  <span className="flex items-center gap-1"><MapPin size={12}/> {item.location}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 3. SEARCH & FILTER */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: Đất vườn, Nhà cấp 4,..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Horizontal Category Scroll */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   <span className="flex items-center gap-2">
                     {activeCategory === cat.id && cat.icon}
                     {cat.name}
                   </span>
                </button>
            ))}
         </div>
      </div>

      {/* 4. PROPERTY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {filteredProperties.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <p>Chưa có tin đăng nào phù hợp.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((item, index) => (
                    <React.Fragment key={item.id}>
                        
                        {/* FLYCAM AD BANNER (Interspersed) */}
                        {index === 2 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 relative overflow-hidden shadow-xl my-4 text-white"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-[60px] rounded-full pointer-events-none"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-2 bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold px-2 py-1 rounded uppercase mb-2">
                                            <Camera size={12} /> Dịch vụ Premium
                                        </div>
                                        <h3 className="text-2xl font-black uppercase leading-tight mb-2">
                                            Bán đất nhanh hơn với <br/> <span className="text-brand-cyan">Flycam 4K</span>
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Momo x HuyKyo cung cấp dịch vụ quay phim bất động sản chuyên nghiệp, giúp khách hàng hình dung toàn cảnh lô đất từ trên cao.
                                        </p>
                                        <button className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-brand-cyan transition-colors shadow-lg shadow-white/10">
                                            Đặt lịch quay ngay
                                        </button>
                                    </div>
                                    <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden border border-gray-700 bg-black">
                                        {/* Placeholder for Drone Image */}
                                        <img 
                                            src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600" 
                                            alt="Drone" 
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* PROPERTY CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {item.isNew && (
                                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                                        Mới đăng
                                    </span>
                                )}
                                {item.isVerified && (
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <CheckCircle2 size={12} fill="currentColor" className="text-blue-500 bg-white rounded-full" />
                                        HuyKyo Verified
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                     <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 flex-1 mr-2">
                                        {item.title}
                                     </h3>
                                </div>
                                
                                <p className="text-yellow-600 font-extrabold text-xl mb-3">
                                    {item.price}
                                </p>

                                <div className="flex items-center gap-4 text-gray-500 text-xs mb-4 pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                                        <Ruler size={14} className="text-gray-400" /> 
                                        <span className="font-semibold">{item.area}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded flex-1 truncate">
                                        <MapPin size={14} className="text-gray-400" /> 
                                        <span className="truncate">{item.location}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                     <a 
                                        href={`tel:${item.contact}`}
                                        className="bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-green-500 transition-colors shadow-md shadow-green-100"
                                     >
                                        <Phone size={14} /> Gọi Chủ Đất
                                     </a>
                                     <a 
                                        href={`https://zalo.me/${item.contact}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-blue-500 transition-colors shadow-md shadow-blue-100"
                                     >
                                        <MessageCircle size={14} /> Zalo
                                     </a>
                                </div>
                            </div>
                        </motion.div>

                    </React.Fragment>
                ))}
            </div>
        )}
      </div>

      {/* 5. FLOATING POST BUTTON */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 border-4 border-white"
      >
          <Plus size={28} />
      </motion.a>
      
      <div className="fixed bottom-6 right-24 bg-black/80 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
          Đăng bán đất
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
      </div>

    </div>
  );
};

export default RealEstatePage;

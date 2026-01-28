
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  X,
  Clock,
  Filter,
  CheckCircle2,
  Utensils,
  Coffee,
  IceCream,
  Wheat
} from 'lucide-react';

interface FoodBeveragePageProps {
  onBack: () => void;
}

// Data Types
interface FoodItem {
  id: number;
  name: string;
  price: number;
  shopName: string;
  shopAvatar: string;
  distance: string;
  isOpen: boolean;
  image: string;
  description: string;
  category: string;
  isVerified: boolean; // For Editor's Choice
  rating: number;
}

// Mock Data
const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Cơm Tấm Sườn Bì Chả",
    price: 35000,
    shopName: "Cơm Tấm Cô Ba",
    shopAvatar: "C",
    distance: "0.5km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1595505776653-534a02c98d6c?auto=format&fit=crop&q=80&w=600",
    description: "Sườn nướng mật ong thơm phức, bì trộn thính gạo rang tay, chả trứng muối béo ngậy. Kèm nước mắm kẹo độc quyền.",
    category: "Cơm/Bún",
    isVerified: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Trà Sữa Nướng Trân Châu",
    price: 25000,
    shopName: "HuyKyo Tea",
    shopAvatar: "H",
    distance: "1.2km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&q=80&w=600",
    description: "Trà sữa đậm vị trà, nướng caramen thơm lừng. Topping trân châu đường đen nấu mới mỗi 4 tiếng.",
    category: "Trà sữa/Cafe",
    isVerified: true,
    rating: 5.0
  },
  {
    id: 3,
    name: "Bún Bò Huế Đặc Biệt",
    price: 40000,
    shopName: "Bún Bò O Nở",
    shopAvatar: "O",
    distance: "2.0km",
    isOpen: false,
    image: "https://images.unsplash.com/photo-1594994272210-67d1db05a107?auto=format&fit=crop&q=80&w=600",
    description: "Nước dùng hầm xương ống 24h, chả cua chuẩn vị Huế. Khoanh giò heo to bự, ăn là ghiền.",
    category: "Cơm/Bún",
    isVerified: false,
    rating: 4.5
  },
  {
    id: 4,
    name: "Xoài Lắc Muối Tôm",
    price: 15000,
    shopName: "Ăn Vặt 135",
    shopAvatar: "A",
    distance: "0.8km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ef?auto=format&fit=crop&q=80&w=600",
    description: "Xoài keo vàng giòn rụm, lắc đều với muối tôm Tây Ninh chính gốc và nước mắm đường.",
    category: "Ăn vặt",
    isVerified: false,
    rating: 4.2
  },
  {
    id: 5,
    name: "Dưa Lưới Organic (1kg)",
    price: 65000,
    shopName: "Nông Trại Xanh",
    shopAvatar: "N",
    distance: "3.5km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1571152766348-18c66e749830?auto=format&fit=crop&q=80&w=600",
    description: "Dưa lưới trồng nhà màng công nghệ cao tại Thạnh Lợi. Ngọt đậm, giòn tan, bao ăn từng trái.",
    category: "Nông sản",
    isVerified: true,
    rating: 4.9
  },
  {
    id: 6,
    name: "Cafe Muối Kem Béo",
    price: 20000,
    shopName: "Góc Phố Coffee",
    shopAvatar: "G",
    distance: "0.3km",
    isOpen: true,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
    description: "Sự kết hợp hoàn hảo giữa vị đắng cafe Robusta và vị mặn béo của lớp kem muối sánh mịn.",
    category: "Trà sữa/Cafe",
    isVerified: false,
    rating: 4.6
  }
];

const categories = [
  { id: "all", name: "Tất cả", icon: <Utensils size={16} /> },
  { id: "Cơm/Bún", name: "Cơm/Bún", icon: <Utensils size={16} /> },
  { id: "Trà sữa/Cafe", name: "Đồ uống", icon: <Coffee size={16} /> },
  { id: "Ăn vặt", name: "Ăn vặt", icon: <IceCream size={16} /> },
  { id: "Nông sản", name: "Nông sản", icon: <Wheat size={16} /> },
];

const FoodBeveragePage: React.FC<FoodBeveragePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering Logic
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesOpen = showOpenOnly ? item.isOpen : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesOpen && matchesSearch;
  });

  const featuredItems = foodItems.filter(item => item.isVerified);

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar text-white">
      {/* 1. Header Sticky */}
      <div className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-lg font-black tracking-wider uppercase">
          ẨM THỰC <span className="text-brand-cyan">THẠNH LỢI</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200" 
          alt="Food Banner" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase mb-2 tracking-tight text-glow">
                Tinh Hoa Ẩm Thực
            </h1>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
                Từ món ngon đường phố đến đặc sản quê nhà - Ship tận nơi
            </p>
            
            <div className="max-w-md mx-auto relative">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Hôm nay bạn muốn ăn gì? (VD: Cơm tấm...)"
                    className="w-full bg-white/10 backdrop-blur-md border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
        </div>
      </section>

      {/* 3. Smart Filter Bar */}
      <section className="sticky top-16 z-40 bg-[#121212] py-4 border-b border-gray-800 shadow-xl">
         <div className="max-w-7xl mx-auto px-4 flex gap-3 overflow-x-auto scrollbar-hide items-center">
            {/* Toggle Open Now */}
            <button 
                onClick={() => setShowOpenOnly(!showOpenOnly)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase transition-all ${
                    showOpenOnly 
                    ? "bg-green-900/30 border-green-500 text-green-400" 
                    : "bg-[#1E1E1E] border-gray-700 text-gray-400"
                }`}
            >
                <div className={`w-2 h-2 rounded-full ${showOpenOnly ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-gray-500"}`}></div>
                Đang mở cửa
            </button>

            <div className="w-[1px] h-6 bg-gray-800 mx-1"></div>

            {/* Categories */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase transition-all whitespace-nowrap ${
                        activeCategory === cat.id
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]"
                        : "bg-[#1E1E1E] border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                    }`}
                >
                    {cat.icon}
                    {cat.name}
                </button>
            ))}
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 4. HuyKyo Editor's Choice */}
        {searchTerm === "" && (
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Star className="text-brand-cyan fill-brand-cyan" size={20} />
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                        HuyKyo Đề Xuất
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredItems.slice(0, 3).map((item) => (
                         <div 
                            key={`featured-${item.id}`}
                            onClick={() => setSelectedItem(item)}
                            className="relative group cursor-pointer rounded-2xl overflow-hidden border border-gray-800 bg-[#1a1a1a]"
                         >
                            {/* Verified Badge */}
                            <div className="absolute top-3 left-3 z-10 bg-brand-cyan text-black text-[10px] font-black uppercase px-2 py-1 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                                <CheckCircle2 size={10} /> Verified by HuyKyo
                            </div>

                            <div className="h-48 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="p-4 bg-gradient-to-t from-black to-[#1a1a1a]">
                                <h3 className="font-bold text-lg text-white mb-1 truncate">{item.name}</h3>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">{item.shopAvatar}</div>
                                        <span className="text-gray-400 text-xs">{item.shopName}</span>
                                    </div>
                                    <span className="text-brand-cyan font-bold">{item.price.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        )}

        {/* 5. Food Listing Grid */}
        <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
             <Utensils className="text-gray-500" size={20} /> Danh sách món ngon
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item) => (
                <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedItem(item)}
                    className="group bg-[#1a1a1a]/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Status Label */}
                        <div className="absolute bottom-2 left-2">
                             {item.isOpen ? (
                                 <span className="bg-black/60 backdrop-blur-md text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Mở cửa
                                 </span>
                             ) : (
                                <span className="bg-black/80 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Đóng cửa
                                </span>
                             )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                        <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-2 min-h-[40px]">
                            {item.name}
                        </h3>
                        <p className="text-brand-cyan font-bold text-base md:text-lg mb-3">
                            {item.price.toLocaleString('vi-VN')}đ
                        </p>

                        <div className="mt-auto pt-3 border-t border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                                    {item.shopAvatar}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-[10px] md:text-xs text-gray-300 truncate font-medium">{item.shopName}</span>
                                    <span className="text-[9px] text-gray-500 flex items-center gap-0.5"><MapPin size={8}/> {item.distance}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions (Visible on Mobile/Hover Desktop) */}
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <button 
                                onClick={(e) => { e.stopPropagation(); /* Call Logic */ }}
                                className="bg-white text-black py-1.5 rounded text-[10px] md:text-xs font-bold uppercase hover:bg-brand-cyan transition-colors flex items-center justify-center gap-1"
                            >
                                <Phone size={12} /> Gọi
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); /* Zalo Logic */ }}
                                className="bg-blue-600 text-white py-1.5 rounded text-[10px] md:text-xs font-bold uppercase hover:bg-blue-500 transition-colors flex items-center justify-center gap-1"
                            >
                                <MessageCircle size={12} /> Zalo
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* 6. Product Detail Popup */}
      <AnimatePresence>
        {selectedItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
                onClick={() => setSelectedItem(null)}
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#1a1a1a] w-full md:max-w-lg rounded-t-2xl md:rounded-2xl border border-gray-800 overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-brand-cyan hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="h-64 overflow-hidden relative">
                        <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                    </div>

                    <div className="p-6 relative -mt-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-black text-white uppercase leading-tight max-w-[70%]">
                                {selectedItem.name}
                            </h2>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-brand-cyan">{selectedItem.price.toLocaleString('vi-VN')}đ</span>
                                <span className="text-xs text-gray-500">Giá chưa bao gồm ship</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 bg-[#252525] p-3 rounded-lg border border-gray-700">
                             <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg">
                                 {selectedItem.shopAvatar}
                             </div>
                             <div>
                                 <p className="font-bold text-white text-sm">{selectedItem.shopName}</p>
                                 <div className="flex items-center gap-3 text-xs text-gray-400">
                                     <span className="flex items-center gap-1"><MapPin size={10} /> {selectedItem.distance}</span>
                                     <span className="flex items-center gap-1 text-yellow-500"><Star size={10} fill="currentColor" /> {selectedItem.rating}</span>
                                 </div>
                             </div>
                             {selectedItem.isVerified && (
                                 <div className="ml-auto text-brand-cyan">
                                     <CheckCircle2 size={20} />
                                 </div>
                             )}
                        </div>

                        <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
                            {selectedItem.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold uppercase hover:bg-gray-200 transition-colors">
                                <Phone size={20} /> Gọi Ngay
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase hover:bg-blue-500 transition-colors">
                                <MessageCircle size={20} /> Chat Zalo
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodBeveragePage;

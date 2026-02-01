
import React, { useState, useEffect } from 'react';
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
  Wheat,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface FoodBeveragePageProps {
  onBack: () => void;
}

// Data Types updated to match CSV structure
interface FoodItem {
  id: number;
  name: string; // mon_an
  price: number; // gia_tien
  shopName: string; // ten_quan
  shopAvatar: string; // derived from ten_quan
  address: string; // dia_chi (NEW)
  isOpen: boolean; // derived from trang_thai
  image: string; // anh_mon_an
  description: string; // mo_ta
  category: string; // loai_mon (Mapped from CSV)
  phone: string; // sdt_zalo
  status: string; // trang_thai (Het / Con)
  rating: number; // default
}

// Google Sheet CSV Link
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=0&single=true&output=csv";

// Cập nhật ID danh mục khớp với dữ liệu cột 'loai_mon' trong CSV
const categories = [
  { id: "all", name: "Tất cả", icon: <Utensils size={16} /> },
  { id: "ComBun", name: "Cơm/Bún", icon: <Utensils size={16} /> },
  { id: "DoUong", name: "Đồ uống", icon: <Coffee size={16} /> },
  { id: "AnVat", name: "Ăn vặt", icon: <IceCream size={16} /> },
  { id: "NongSan", name: "Nông sản", icon: <Wheat size={16} /> },
];

const FoodBeveragePage: React.FC<FoodBeveragePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for fetched data
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CSV Parsing Helper
  const parseCSV = (text: string): FoodItem[] => {
    const rows = text.split('\n');
    
    // Robust CSV Line Parser
    const parseLine = (line: string): string[] => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        return parts.map(part => {
            let p = part.trim();
            if (p.startsWith('"') && p.endsWith('"')) {
                p = p.slice(1, -1);
            }
            return p.replace(/""/g, '"');
        });
    };

    if (rows.length === 0) return [];
    
    // Parse headers
    const headers = parseLine(rows[0]);
    
    // Mapping helper to find index by header name (insensitive)
    const getIndex = (keys: string[]) => {
        return headers.findIndex(h => keys.includes(h.toLowerCase().trim()));
    };

    const idxName = getIndex(['mon_an', 'ten_mon']);
    const idxImage = getIndex(['anh_mon_an', 'hinh_anh']);
    const idxPrice = getIndex(['gia_tien', 'gia']);
    const idxShop = getIndex(['ten_quan', 'shop']);
    const idxPhone = getIndex(['sdt_zalo', 'sdt']);
    const idxStatus = getIndex(['trang_thai']);
    const idxAddress = getIndex(['dia_chi']);
    // Tìm cột loai_mon (hoặc phan_loai cũ làm fallback)
    const idxCategory = getIndex(['loai_mon', 'phan_loai', 'category']);
    const idxDesc = getIndex(['mo_ta']);

    const parsedData = rows.slice(1).filter(r => r.trim() !== '').map((row, index) => {
      const values = parseLine(row);
      
      const getValue = (i: number) => {
         if (i === -1 || i >= values.length) return '';
         return values[i].trim();
      };

      const status = getValue(idxStatus);
      const isOpen = status.toLowerCase() !== 'het';
      const name = getValue(idxName) || "Món chưa đặt tên";
      const shopName = getValue(idxShop) || "Cửa hàng Thạnh Lợi";
      const address = getValue(idxAddress) || "Thạnh Lợi, Bến Lức";
      
      return {
        id: index,
        name: name,
        image: getValue(idxImage) || "https://placehold.co/600x600/1a1a1a/FFF?text=HuyKyo+Food",
        price: parseInt(getValue(idxPrice).replace(/\D/g, '')) || 0,
        shopName: shopName,
        shopAvatar: shopName.charAt(0).toUpperCase(),
        phone: getValue(idxPhone),
        status: status,
        isOpen: isOpen,
        address: address,
        description: getValue(idxDesc) || `Món ngon từ ${shopName}. Đặt hàng ngay để thưởng thức!`,
        category: getValue(idxCategory), // Lấy giá trị chính xác từ cột loai_mon (VD: ComBun, DoUong)
        rating: 5.0,
      };
    });

    // Fisher-Yates Shuffle: Xáo trộn ngẫu nhiên danh sách món ăn
    for (let i = parsedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [parsedData[i], parsedData[j]] = [parsedData[j], parsedData[i]];
    }

    return parsedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Không thể tải dữ liệu");
        const text = await response.text();
        const data = parseCSV(text);
        setFoodItems(data);
      } catch (err) {
        console.error("Error fetching food data:", err);
        setError("Không thể kết nối đến máy chủ dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtering Logic Updated
  const filteredItems = foodItems.filter(item => {
    // 1. Filter by Category (Exact Match with 'loai_mon')
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    
    // 2. Filter by Open Status
    const matchesOpen = showOpenOnly ? item.isOpen : true;
    
    // 3. Filter by Search Term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesOpen && matchesSearch;
  });

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
        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
             <p>Đang tải menu món ngon...</p>
          </div>
        )}

        {error && (
           <div className="flex flex-col items-center justify-center py-20 text-red-500">
             <AlertCircle size={32} className="mb-4" />
             <p>{error}</p>
           </div>
        )}

        {!isLoading && !error && (
            <>
                <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
                    <Utensils className="text-gray-500" size={20} /> Danh sách món ngon ({filteredItems.length})
                </h2>
                
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Không tìm thấy món ăn nào phù hợp với bộ lọc.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredItems.map((item) => {
                            const isSoldOut = item.status?.toLowerCase() === 'het';

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: isSoldOut ? 0 : -5 }}
                                    onClick={() => !isSoldOut && setSelectedItem(item)}
                                    className={`group bg-[#1a1a1a]/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full relative ${
                                        isSoldOut ? 'opacity-60 grayscale cursor-not-allowed border-red-900/30' : 'hover:border-brand-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] cursor-pointer'
                                    }`}
                                >
                                    {/* Image (Top 1:1) */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-900">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://placehold.co/600x600/1a1a1a/FFF?text=HuyKyo+Food";
                                            }}
                                        />
                                        {/* Status Label */}
                                        <div className="absolute bottom-2 left-2 z-10">
                                            {isSoldOut ? (
                                                <span className="bg-red-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-md">
                                                    HẾT MÓN
                                                </span>
                                            ) : (
                                                <span className="bg-black/60 backdrop-blur-md text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Mở cửa
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                                        {/* Food Name - Large & Bold */}
                                        <h3 className="text-base md:text-lg font-black text-white mb-1 line-clamp-2 min-h-[48px] leading-tight">
                                            {item.name}
                                        </h3>
                                        
                                        {/* Price - Highlighted */}
                                        <p className={`font-bold text-base md:text-lg mb-3 ${isSoldOut ? 'text-gray-500 line-through' : 'text-yellow-400'}`}>
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </p>

                                        <div className="mt-auto border-t border-gray-800 pt-3">
                                            {/* Shop Name - Bold, Small */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {item.shopAvatar}
                                                </div>
                                                <span className="text-sm font-bold text-gray-300">
                                                    {item.shopName}
                                                </span>
                                            </div>
                                            
                                            {/* Address - Gray, Icon (NEW FEATURE) */}
                                            <div className="flex items-start gap-1.5 text-xs text-gray-500 pl-0.5 mb-3">
                                                <MapPin size={12} className="mt-0.5 shrink-0 text-gray-600" />
                                                <span className="line-clamp-2">{item.address}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {isSoldOut ? (
                                                    <button 
                                                        disabled 
                                                        className="col-span-2 w-full bg-gray-700 text-gray-400 py-2 rounded text-[10px] md:text-xs font-bold uppercase cursor-not-allowed flex items-center justify-center gap-1"
                                                    >
                                                        Tạm hết hàng
                                                    </button>
                                                ) : (
                                                    <>
                                                        <a 
                                                            href={`tel:${item.phone}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full bg-green-600 text-white py-2 rounded text-[10px] md:text-xs font-bold uppercase hover:bg-green-500 transition-colors flex items-center justify-center gap-1 shadow-lg shadow-green-900/20"
                                                        >
                                                            <Phone size={14} /> Gọi Ngay
                                                        </a>
                                                        <a 
                                                            href={`https://zalo.me/${item.phone}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full bg-blue-600 text-white py-2 rounded text-[10px] md:text-xs font-bold uppercase hover:bg-blue-500 transition-colors flex items-center justify-center gap-1 shadow-lg shadow-blue-900/20"
                                                        >
                                                            <MessageCircle size={14} /> Zalo
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </>
        )}
      </div>

      {/* Product Detail Popup */}
      <AnimatePresence>
        {selectedItem && selectedItem.status.toLowerCase() !== 'het' && (
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
                        <img 
                            src={selectedItem.image} 
                            alt={selectedItem.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x600/1a1a1a/FFF?text=HuyKyo+Food";
                            }}
                        />
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                    </div>

                    <div className="p-6 relative -mt-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-black text-white uppercase leading-tight max-w-[70%]">
                                {selectedItem.name}
                            </h2>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-yellow-400">{selectedItem.price.toLocaleString('vi-VN')}đ</span>
                                <span className="text-xs text-gray-500">Giá chưa bao gồm ship</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 bg-[#252525] p-3 rounded-lg border border-gray-700">
                             <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg text-white">
                                 {selectedItem.shopAvatar}
                             </div>
                             <div>
                                 <p className="font-bold text-white text-sm">{selectedItem.shopName}</p>
                                 <div className="flex items-center gap-3 text-xs text-gray-400">
                                     <span className="flex items-center gap-1"><MapPin size={10} /> {selectedItem.address}</span>
                                     <span className="flex items-center gap-1 text-yellow-500"><Star size={10} fill="currentColor" /> {selectedItem.rating}</span>
                                 </div>
                             </div>
                        </div>

                        <p className="text-gray-400 leading-relaxed mb-8 text-sm md:text-base">
                            {selectedItem.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <a 
                                href={`tel:${selectedItem.phone}`}
                                className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold uppercase hover:bg-gray-200 transition-colors"
                            >
                                <Phone size={20} /> Gọi Ngay
                            </a>
                            <a 
                                href={`https://zalo.me/${selectedItem.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase hover:bg-blue-500 transition-colors"
                            >
                                <MessageCircle size={20} /> Chat Zalo
                            </a>
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

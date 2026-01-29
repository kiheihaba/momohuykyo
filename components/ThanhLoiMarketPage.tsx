
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  PlusCircle,
  Utensils,
  Wrench,
  Shirt,
  Briefcase,
  Car,
  Home,
  Star,
  Camera,
  Music,
  RefreshCw
} from 'lucide-react';
import Footer from './Footer';

interface ThanhLoiMarketPageProps {
  onBack: () => void;
  onOpenFood?: () => void;
  onOpenServices?: () => void;
  onOpenJobs?: () => void;
  onOpenRealEstate?: () => void;
}

// Interface chuẩn cho Listing hiển thị ở trang chủ
interface MarketListing {
  id: string | number;
  title: string;
  price: string;
  seller: string;
  location: string;
  image: string;
  category: string;
  phone?: string;
  isAd?: boolean;
  timestamp?: number; // Dùng để sort tin mới nhất
}

// 1. CẤU HÌNH LINK GOOGLE SHEET (CSV)
// Bạn có thể thêm link cho các danh mục khác vào đây
const SHEET_URLS = {
    FOOD: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=0&single=true&output=csv",
    SERVICES: "", // Điền Link CSV Sheet Dịch vụ vào đây
    JOBS: "",     // Điền Link CSV Sheet Việc làm vào đây
    REAL_ESTATE: "" // Điền Link CSV Sheet Nhà đất vào đây
};

// Dữ liệu danh mục
const categories = [
  { id: 1, name: "Ẩm Thực", icon: <Utensils size={24} />, color: "bg-orange-100 text-orange-600" },
  { id: 2, name: "Dịch Vụ", icon: <Wrench size={24} />, color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Việc Làm", icon: <Briefcase size={24} />, color: "bg-green-100 text-green-600" }, 
  { id: 4, name: "Thời Trang", icon: <Shirt size={24} />, color: "bg-pink-100 text-pink-600" },
  { id: 5, name: "Xe Cộ", icon: <Car size={24} />, color: "bg-red-100 text-red-600" },
  { id: 6, name: "Bất động sản", icon: <Home size={24} />, color: "bg-purple-100 text-purple-600" },
];

// Dữ liệu tin đăng mẫu (Fallback khi chưa có Sheet hoặc đang tải)
const STATIC_LISTINGS: MarketListing[] = [
  {
    id: "s1",
    title: "Cần bán xe Wave Alpha đời 2020 chính chủ",
    price: "12.500.000 đ",
    seller: "Anh Tư Xe Máy",
    location: "Ngã 4 Thạnh Lợi",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
    category: "Xe Cộ",
    isAd: false,
    timestamp: 1
  },
  {
    id: "s2",
    title: "Tuyển 5 thợ hồ làm công trình nhà ở",
    price: "500.000 đ/ngày",
    seller: "Cai Thầu Năm",
    location: "Khu dân cư 135",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
    category: "Việc Làm",
    isAd: false,
    timestamp: 2
  },
  {
    id: "s3",
    title: "Đất thổ cư 100m2 gần UBND xã",
    price: "850 triệu",
    seller: "BĐS Hưng Thịnh",
    location: "Trung tâm xã",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
    category: "Bất động sản",
    isAd: false,
    timestamp: 3
  },
  {
      id: "s4",
      title: "Sửa chữa điện nước tại nhà 24/7",
      price: "Thương lượng",
      seller: "Điện lạnh Minh Tuấn",
      location: "Phục vụ toàn xã",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
      category: "Dịch Vụ",
      isAd: false,
      timestamp: 4
  }
];

const ThanhLoiMarketPage: React.FC<ThanhLoiMarketPageProps> = ({ 
  onBack, 
  onOpenFood, 
  onOpenServices, 
  onOpenJobs,
  onOpenRealEstate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState<MarketListing[]>(STATIC_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Parse CSV Line safely
  const parseCSVLine = (line: string): string[] => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return parts.map(part => {
          let p = part.trim();
          if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
          return p.replace(/""/g, '"');
      });
  };

  useEffect(() => {
    const fetchAllData = async () => {
        setIsLoading(true);
        let allNewListings: MarketListing[] = [];

        // 1. Fetch Food Data
        if (SHEET_URLS.FOOD) {
            try {
                const response = await fetch(SHEET_URLS.FOOD);
                const text = await response.text();
                const rows = text.split('\n').slice(1); // Skip header

                const foodItems: MarketListing[] = rows
                    .filter(r => r.trim() !== '')
                    .map((row, index): MarketListing | null => {
                        const cols = parseCSVLine(row);
                        // Mapping based on Food Sheet structure:
                        // 0:mon_an, 1:anh_mon_an, 2:gia_tien, 3:mo_ta, 4:phan_loai, 5:ten_quan, 6:dia_chi, 7:sdt_zalo, 8:trang_thai
                        
                        // Simple helper to get column safely
                        const getCol = (i: number) => (cols[i] || "").trim();

                        if (getCol(8).toLowerCase() === 'het') return null; // Skip sold out items on homepage

                        return {
                            id: `food-${index}`,
                            title: getCol(0) || "Món ngon chưa đặt tên",
                            image: getCol(1) || "https://placehold.co/600x400?text=Food",
                            price: getCol(2) ? `${parseInt(getCol(2).replace(/\D/g, '')).toLocaleString('vi-VN')} đ` : "Liên hệ",
                            seller: getCol(5) || "Cửa hàng",
                            location: getCol(6) || "Thạnh Lợi",
                            category: "Ẩm Thực",
                            phone: getCol(7),
                            isAd: false,
                            timestamp: Date.now() + index // Mock timestamp to keep order
                        };
                    })
                    .filter((item): item is MarketListing => item !== null)
                    .slice(0, 8); // Take top 8 latest food items
                
                allNewListings = [...allNewListings, ...foodItems];
            } catch (error) {
                console.error("Error fetching food sheet:", error);
            }
        }

        // 2. Fetch Services/Jobs/RealEstate (If URLs provided)
        // Future implementation: Add similar blocks here for other SHEET_URLS
        
        // 3. Merge with Static Data
        // Combine fetched data with static data (for categories that don't have sheets yet)
        const combined = [...allNewListings, ...STATIC_LISTINGS];
        
        // 4. Shuffle/Sort Logic (Optional: Here we just put new fetched items first)
        // In a real app with 'created_at' in CSV, we would sort by date.
        
        setListings(combined);
        setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const handleCategoryClick = (catName: string) => {
    if (catName === "Ẩm Thực" && onOpenFood) {
        onOpenFood();
    } else if (catName === "Dịch Vụ" && onOpenServices) {
        onOpenServices();
    } else if (catName === "Việc Làm" && onOpenJobs) {
        onOpenJobs();
    } else if (catName === "Bất động sản" && onOpenRealEstate) {
        onOpenRealEstate();
    }
  };

  const filteredListings = listings.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* 1. HEADER (Cyberpunk Style - Dark) */}
      <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-4 md:px-8 shadow-md">
         <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="text-white hover:text-brand-cyan transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
                <div className="bg-green-600 p-1.5 rounded-lg">
                    <MapPin size={16} className="text-white" />
                </div>
                <span className="font-bold text-white tracking-tight text-lg">
                    CHỢ ONLINE <span className="text-green-500">THẠNH LỢI</span>
                </span>
            </div>
         </div>
         
         <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs uppercase flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
            <PlusCircle size={16} /> <span className="hidden md:inline">Đăng tin</span>
         </button>
      </div>

      {/* 2. HERO SECTION (Light Mode) */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center relative z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
            >
                Kết nối giao thương <span className="text-green-600">Quê Nhà</span>
            </motion.h1>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                Tìm kiếm sản phẩm, dịch vụ và việc làm tại xã Thạnh Lợi nhanh chóng, uy tín và hoàn toàn miễn phí.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
                <input 
                    type="text" 
                    placeholder="Bạn đang tìm gì hôm nay? (Ví dụ: Gà ta, Thợ hồ...)"
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-black transition-colors">
                    Tìm kiếm
                </button>
            </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} /> Danh mục phổ biến
            </h2>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
                <motion.div 
                    key={cat.id}
                    whileHover={{ y: -5 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all"
                >
                    <div className={`p-3 rounded-full ${cat.color}`}>
                        {cat.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 4. MOMO X HUYKYO AD BANNER (Interspersed) */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="bg-[#121212] rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center border border-gray-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 z-10">
                <div className="inline-block bg-brand-cyan text-black text-xs font-black px-2 py-1 uppercase mb-4">
                    Dịch vụ nổi bật
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-4">
                    Rạp Cưới & Media <br/> <span className="text-brand-cyan">Trọn Gói</span>
                </h3>
                <p className="text-gray-400 mb-6 text-sm md:text-base">
                    Momo x HuyKyo cung cấp dịch vụ trang trí tiệc cưới, quay phim chụp ảnh sự kiện với phong cách hiện đại nhất tại Thạnh Lợi.
                </p>
                <div className="flex gap-4">
                    <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-brand-cyan transition-colors flex items-center gap-2">
                        <Camera size={16} /> Xem mẫu rạp
                    </button>
                    <button className="border border-gray-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:border-brand-cyan hover:text-brand-cyan transition-colors flex items-center gap-2">
                        <Music size={16} /> Thuê âm thanh
                    </button>
                </div>
            </div>
            <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" 
                    alt="Wedding Decor" 
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#121212]"></div>
            </div>
        </div>
      </section>

      {/* 5. LISTING GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Tin đăng mới nhất {isLoading && <RefreshCw className="animate-spin text-green-600" size={16} />}
            </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                            }}
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                            {item.category}
                        </span>
                        {item.category === "Ẩm Thực" && (
                            <span className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                Mới đăng
                            </span>
                        )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[48px] text-sm md:text-base leading-tight">
                            {item.title}
                        </h3>
                        <p className="text-red-600 font-extrabold text-lg mb-3">
                            {item.price}
                        </p>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                            <MapPin size={14} className="flex-shrink-0" /> <span className="truncate">{item.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                             <div className="flex items-center gap-2 max-w-[50%]">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                    {item.seller.charAt(0)}
                                </div>
                                <span className="text-xs font-semibold text-gray-700 truncate">{item.seller}</span>
                             </div>
                             
                             <div className="flex gap-2">
                                {item.phone ? (
                                    <>
                                        <a href={`https://zalo.me/${item.phone}`} target="_blank" rel="noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors" title="Chat Zalo">
                                            <MessageCircle size={16} />
                                        </a>
                                        <a href={`tel:${item.phone}`} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors" title="Gọi ngay">
                                            <Phone size={16} />
                                        </a>
                                    </>
                                ) : (
                                    <button className="bg-gray-300 text-gray-500 p-2 rounded-full cursor-not-allowed">
                                        <Phone size={16} />
                                    </button>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">
                Xem thêm tin đăng
            </button>
        </div>
      </section>

      {/* Footer (Reusing the Dark Footer style for consistency) */}
      <Footer />
    </div>
  );
};

export default ThanhLoiMarketPage;


import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  PlusCircle,
  Utensils,
  Wrench,
  ShoppingBag,
  Briefcase,
  Car,
  Home,
  Star,
  RefreshCw,
  XCircle,
  AlertCircle,
  User,
  ChevronDown,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import Footer from './Footer';

interface ThanhLoiMarketPageProps {
  onBack: () => void;
  onOpenFood?: () => void;
  onOpenServices?: () => void;
  onOpenJobs?: () => void;
  onOpenRealEstate?: () => void;
  onOpenFashion?: () => void;
  onOpenVehicles?: () => void;
  onOpenGeneralMarket?: () => void;
}

// Interface chuẩn hóa cho mọi loại dữ liệu
interface MarketListing {
  id: string;
  type: 'food' | 'service' | 'job' | 'market' | 'vehicle' | 'real_estate';
  title: string;
  price: string;
  seller: string;      // Tên quán, tên thợ, người bán, người tuyển
  location: string;
  image: string;
  phone: string;
  timestamp: number;   // Để sắp xếp mới nhất
  
  // Các trường phụ cho từng loại
  category?: string;   // Dùng cho Market/Food
  description?: string; // Dùng cho Service/Job
  area?: string;       // Dùng cho RealEstate
  linkProfile?: string; // Dùng cho Service
  salary?: string;     // Dùng cho Job (alias của price)
}

// 1. CẤU HÌNH 6 NGUỒN DỮ LIỆU
const DATA_SOURCES = {
    FOOD: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=0&single=true&output=csv',
    MARKET: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=964173450&single=true&output=csv',
    SERVICES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=987608880&single=true&output=csv',
    JOBS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1687973723&single=true&output=csv',
    VEHICLES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=522785751&single=true&output=csv',
    REAL_ESTATE: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=318672864&single=true&output=csv'
};

const categories = [
  { id: 1, name: "Chợ Mua Sắm", icon: <ShoppingBag size={24} />, color: "bg-teal-100 text-teal-600", action: "onOpenGeneralMarket" },
  { id: 2, name: "Ẩm Thực", icon: <Utensils size={24} />, color: "bg-orange-100 text-orange-600", action: "onOpenFood" },
  { id: 3, name: "Dịch Vụ", icon: <Wrench size={24} />, color: "bg-blue-100 text-blue-600", action: "onOpenServices" },
  { id: 4, name: "Việc Làm", icon: <Briefcase size={24} />, color: "bg-green-100 text-green-600", action: "onOpenJobs" }, 
  { id: 5, name: "Xe Cộ", icon: <Car size={24} />, color: "bg-red-100 text-red-600", action: "onOpenVehicles" },
  { id: 6, name: "Bất Động Sản", icon: <Home size={24} />, color: "bg-purple-100 text-purple-600", action: "onOpenRealEstate" },
];

const ThanhLoiMarketPage: React.FC<ThanhLoiMarketPageProps> = ({ 
  onBack, 
  onOpenFood, 
  onOpenServices, 
  onOpenJobs, 
  onOpenRealEstate,
  onOpenFashion,
  onOpenVehicles,
  onOpenGeneralMarket
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [allListings, setAllListings] = useState<MarketListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // --- HELPER: Xử lý Tiếng Việt ---
  const removeVietnameseTones = (str: string) => {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str.toLowerCase().trim();
  }

  // Helper: Normalize CSV Header
  const normalizeHeader = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]/g, "");
  };

  const parseCSVLine = (line: string): string[] => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return parts.map(part => {
          let p = part.trim();
          if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
          return p.replace(/""/g, '"');
      });
  };

  // --- 2. THUẬT TOÁN XỬ LÝ & TÌM KIẾM ---
  // --- FETCH DATA TỪ 6 NGUỒN ---
  useEffect(() => {
    const fetchAllData = async () => {
        setIsLoading(true);
        
        const fetchSource = async (url: string, type: MarketListing['type']) => {
            try {
                const response = await fetch(url);
                if (!response.ok) return [];
                const text = await response.text();
                const rows = text.split('\n');
                if (rows.length < 2) return [];

                const headers = parseCSVLine(rows[0]);
                const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(normalizeHeader(h)));

                // Common Indexes
                const idxName = getIndex(['ten', 'name', 'title', 'monan', 'tensanpham', 'congviec', 'tenxe', 'tieude']);
                const idxPrice = getIndex(['gia', 'price', 'giatien', 'mucluong', 'giaban']);
                const idxImage = getIndex(['anh', 'image', 'hinhanh', 'avatar', 'anhdaidien']);
                const idxPhone = getIndex(['sdt', 'phone', 'contact', 'sdtlienhe', 'sdtzalo']);
                const idxLocation = getIndex(['diachi', 'location', 'khuvuc', 'vitri', 'diadiem']);
                
                // Specific Indexes
                const idxSeller = getIndex(['nguoiban', 'shop', 'tenquan', 'nguoituyen', 'tentho', 'seller']);
                const idxCategory = getIndex(['loai', 'category', 'nghanhnghe', 'phanloai', 'loaixe', 'loaibds']);
                const idxDesc = getIndex(['mota', 'description', 'yeucau', 'chitiet']);
                const idxArea = getIndex(['dientich', 'area']);
                const idxLinkProfile = getIndex(['linkprofile', 'profile']);

                return rows.slice(1)
                    .filter(r => r.trim() !== '')
                    .map((row, index) => {
                        const cols = parseCSVLine(row);
                        const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";
                        
                        // Fallback logic
                        let sellerName = getCol(idxSeller);
                        if (!sellerName && type === 'service') sellerName = "Thợ Thạnh Lợi";
                        if (!sellerName && type === 'job') sellerName = "Tuyển dụng";
                        if (!sellerName) sellerName = "Người bán";

                        let priceDisplay = getCol(idxPrice);
                        if (!priceDisplay || priceDisplay === '0') priceDisplay = "Liên hệ";
                        else if (!isNaN(Number(priceDisplay.replace(/\D/g, '')))) {
                           // Basic format if it's a plain number
                           const num = parseInt(priceDisplay.replace(/\D/g, ''));
                           if(num > 1000) priceDisplay = num.toLocaleString('vi-VN') + ' đ';
                        }

                        return {
                            id: `${type}-${index}`,
                            type: type,
                            title: getCol(idxName) || "Không có tên",
                            price: priceDisplay,
                            seller: sellerName,
                            location: getCol(idxLocation) || "Thạnh Lợi",
                            image: getCol(idxImage) || `https://placehold.co/600x400?text=${type.toUpperCase()}`,
                            phone: getCol(idxPhone),
                            timestamp: Date.now() + index, // Mock timestamp order
                            category: getCol(idxCategory),
                            description: getCol(idxDesc),
                            area: getCol(idxArea),
                            linkProfile: getCol(idxLinkProfile)
                        } as MarketListing;
                    });
            } catch (e) {
                console.error(`Error fetching ${type}:`, e);
                return [];
            }
        };

        try {
            const [food, market, services, jobs, vehicles, realEstate] = await Promise.all([
                fetchSource(DATA_SOURCES.FOOD, 'food'),
                fetchSource(DATA_SOURCES.MARKET, 'market'),
                fetchSource(DATA_SOURCES.SERVICES, 'service'),
                fetchSource(DATA_SOURCES.JOBS, 'job'),
                fetchSource(DATA_SOURCES.VEHICLES, 'vehicle'),
                fetchSource(DATA_SOURCES.REAL_ESTATE, 'real_estate')
            ]);

            // Gộp tất cả dữ liệu
            const combinedData = [
                ...realEstate, // Nhà đất ưu tiên
                ...vehicles,
                ...jobs,
                ...food, 
                ...services, 
                ...market
            ];
            
            // Randomize slightly or sort by simulated timestamp
            setAllListings(combinedData);
            setFilteredListings(combinedData); // Init with all
        } catch (error) {
            console.error("Global fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchAllData();
  }, []);

  // --- DEBOUNCE SEARCH ---
  useEffect(() => {
      const timer = setTimeout(() => {
          setDebouncedSearchTerm(searchTerm);
      }, 300); // 300ms delay

      return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- FILTER LOGIC ---
  useEffect(() => {
      if (!debouncedSearchTerm.trim()) {
          setFilteredListings(allListings); // Show all if no search
          return;
      }

      const query = removeVietnameseTones(debouncedSearchTerm);
      const results = allListings.filter(item => {
          const matchTitle = removeVietnameseTones(item.title).includes(query);
          const matchSeller = removeVietnameseTones(item.seller).includes(query);
          const matchCategory = removeVietnameseTones(item.category || "").includes(query);
          
          return matchTitle || matchSeller || matchCategory;
      });

      setFilteredListings(results);
      setVisibleCount(12); // Reset pagination
  }, [debouncedSearchTerm, allListings]);

  const handleCategoryClick = (catName: string, actionName: string) => {
      // Direct navigation logic
      if (actionName === "onOpenFood" && onOpenFood) onOpenFood();
      else if (actionName === "onOpenServices" && onOpenServices) onOpenServices();
      else if (actionName === "onOpenJobs" && onOpenJobs) onOpenJobs();
      else if (actionName === "onOpenRealEstate" && onOpenRealEstate) onOpenRealEstate();
      else if (actionName === "onOpenVehicles" && onOpenVehicles) onOpenVehicles();
      else if (actionName === "onOpenGeneralMarket" && onOpenGeneralMarket) onOpenGeneralMarket();
  };

  const handleLoadMore = () => {
      setVisibleCount(prev => prev + 12);
  };

  // --- 3. DYNAMIC CARD RENDERING ---
  const renderCard = (item: MarketListing) => {
      // Common wrapper style
      const wrapperClass = "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full";

      switch (item.type) {
          case 'market':
              return (
                  <motion.div layout className={wrapperClass}>
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded">MUA SẮM</span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[40px] text-sm">{item.title}</h3>
                          <p className="font-black text-blue-600 text-lg mb-3">{item.price}</p>
                          <div className="mt-auto pt-3 border-t border-gray-100">
                              <a href={`tel:${item.phone}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded font-bold uppercase text-xs hover:bg-blue-500 transition-colors">
                                  MUA NGAY
                              </a>
                          </div>
                      </div>
                  </motion.div>
              );

          case 'food':
              return (
                  <motion.div layout className={wrapperClass}>
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                           <span className="absolute top-2 left-2 bg-orange-500/90 text-white text-[10px] font-bold px-2 py-1 rounded">ẨM THỰC</span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                          <div className="flex justify-between items-center mb-2">
                             <p className="font-bold text-orange-500 text-base">{item.price}</p>
                             <span className="text-xs text-gray-500 truncate max-w-[80px]">{item.seller}</span>
                          </div>
                          <div className="mt-auto pt-3 border-t border-gray-100">
                              <a href={`tel:${item.phone}`} className="flex items-center justify-center gap-1 w-full bg-orange-500 text-white py-2 rounded font-bold uppercase text-xs hover:bg-orange-400 transition-colors">
                                  <Phone size={14} /> GỌI MÓN
                              </a>
                          </div>
                      </div>
                  </motion.div>
              );

          case 'service':
              return (
                  <motion.div layout className={wrapperClass}>
                      <div className="p-5 flex flex-col items-center text-center h-full">
                           <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500 p-0.5 mb-3">
                               <img src={item.image} alt={item.title} className="w-full h-full rounded-full object-cover" />
                           </div>
                           <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                           <p className="text-xs text-gray-500 mb-4 bg-gray-100 px-2 py-1 rounded-full">{item.category || "Dịch vụ"}</p>
                           <div className="mt-auto w-full">
                               <a href={`tel:${item.phone}`} className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded font-bold uppercase text-xs hover:bg-green-500 transition-colors shadow-lg shadow-green-100">
                                  <Wrench size={14} /> GỌI THỢ
                               </a>
                           </div>
                      </div>
                  </motion.div>
              );

          case 'job':
              return (
                  <motion.div layout className={`${wrapperClass} bg-gradient-to-br from-white to-purple-50`}>
                      <div className="p-5 flex flex-col h-full">
                          <div className="flex justify-between mb-2">
                             <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase">VIỆC LÀM</span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{item.title}</h3>
                          <p className="text-yellow-600 font-black text-xl mb-1">{item.price}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                              <MapPin size={12} /> {item.location}
                          </div>
                          <div className="mt-auto">
                              <a href={`tel:${item.phone}`} className="block w-full text-center bg-purple-700 text-white py-2.5 rounded font-bold uppercase text-xs hover:bg-purple-600 transition-colors shadow-lg shadow-purple-100">
                                  ỨNG TUYỂN
                              </a>
                          </div>
                      </div>
                  </motion.div>
              );

          case 'vehicle':
              return (
                  <motion.div layout className={`${wrapperClass} border-red-100`}>
                       <div className="relative h-40 overflow-hidden bg-gray-900">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
                               <p className="text-white font-bold text-sm truncate">{item.title}</p>
                           </div>
                           <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">XE CỘ</span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                          <p className="font-black text-red-600 text-xl mb-2">{item.price}</p>
                          <div className="mt-auto">
                              <a href={`tel:${item.phone}`} className="block w-full text-center border border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-2 rounded font-bold uppercase text-xs transition-colors">
                                  XEM XE
                              </a>
                          </div>
                      </div>
                  </motion.div>
              );

          case 'real_estate':
              return (
                  <motion.div layout className={wrapperClass}>
                       <div className="relative h-48 overflow-hidden bg-gray-200">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                           <span className="absolute top-2 left-2 bg-[#8B4513] text-white text-[10px] font-bold px-2 py-1 rounded">NHÀ ĐẤT</span>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex justify-between items-center mb-3">
                              <span className="font-bold text-[#8B4513] text-base">{item.price}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.area}</span>
                          </div>
                          <div className="mt-auto">
                              <a href={`tel:${item.phone}`} className="block w-full text-center bg-[#8B4513] text-white py-2 rounded font-bold uppercase text-xs hover:bg-[#A0522D] transition-colors">
                                  XEM ĐẤT
                              </a>
                          </div>
                      </div>
                  </motion.div>
              );

          default:
              return null;
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-gray-800 h-16 flex items-center justify-between px-4 md:px-8 shadow-md">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white hover:text-brand-cyan transition-colors">
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
         <a href="https://zalo.me/0386328473" target="_blank" rel="noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs uppercase flex items-center gap-2 transition-colors shadow-lg">
            <PlusCircle size={16} /> <span className="hidden md:inline">Đăng tin</span>
         </a>
      </div>

      {/* 2. HERO SEARCH */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center relative z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
            >
                Tìm gì cũng có tại <span className="text-green-600">Thạnh Lợi</span>
            </motion.h1>
            
            <div className="max-w-2xl mx-auto relative group">
                <input 
                    type="text" 
                    placeholder="Bạn đang tìm gì? (VD: Cơm tấm, Xe cũ, Việc làm...)"
                    className="w-full pl-12 pr-12 py-4 rounded-full border border-gray-300 shadow-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white text-gray-900 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                        <XCircle size={20} />
                    </button>
                )}
            </div>
            
            {/* Quick Suggestions */}
            {!debouncedSearchTerm && (
                 <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-gray-500">
                     <span>Gợi ý:</span>
                     <button onClick={() => setSearchTerm("Cơm")} className="hover:text-green-600 underline">Cơm tấm</button>
                     <button onClick={() => setSearchTerm("Xe")} className="hover:text-green-600 underline">Xe máy cũ</button>
                     <button onClick={() => setSearchTerm("Việc")} className="hover:text-green-600 underline">Việc làm phổ thông</button>
                 </div>
            )}
        </div>
      </section>

      {/* 3. CATEGORIES (Ẩn khi đang Search) */}
      {!debouncedSearchTerm && (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <motion.div 
                        key={cat.id}
                        whileHover={{ y: -5 }}
                        onClick={() => handleCategoryClick(cat.name, cat.action)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all text-center h-full"
                    >
                        <div className={`p-3 rounded-full ${cat.color}`}>
                            {cat.icon}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 block leading-tight">{cat.name}</span>
                    </motion.div>
                ))}
            </div>
        </section>
      )}

      {/* 4. RESULTS GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-20 mt-4">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {debouncedSearchTerm ? `Kết quả cho "${searchTerm}"` : "Tin mới nhất"}
                {isLoading && <RefreshCw className="animate-spin text-green-600" size={16} />}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredListings.length} tin</span>
        </div>
        
        {/* Empty State */}
        {!isLoading && filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm text-center px-4">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 text-sm max-w-md">
                    Rất tiếc, không tìm thấy tin nào ở Thạnh Lợi cho từ khóa "{searchTerm}". Hãy thử từ khóa ngắn gọn hơn (VD: "xe", "đất").
                </p>
                <button 
                    onClick={() => setSearchTerm("")} 
                    className="mt-6 bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                    Xóa tìm kiếm
                </button>
            </div>
        )}

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.slice(0, visibleCount).map((item) => (
                <div key={item.id} className="h-full">
                    {renderCard(item)}
                </div>
            ))}
        </div>
        
        {/* Load More */}
        {visibleCount < filteredListings.length && (
            <div className="text-center mt-12">
                <button 
                    onClick={handleLoadMore}
                    className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 mx-auto shadow-sm"
                >
                    Xem thêm <ChevronDown size={16} />
                </button>
            </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ThanhLoiMarketPage;

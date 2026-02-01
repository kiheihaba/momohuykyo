
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Bike,
  Car,
  Truck,
  Tractor,
  Filter,
  Calendar,
  Gauge,
  FileCheck,
  ShieldCheck,
  Tag,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface VehiclePageProps {
  onBack: () => void;
}

interface VehicleItem {
  id: string;
  title: string;        // tieu_de
  price: string;        // gia_ban
  type: string;         // loai_xe
  year: string;         // nam_sx
  location: string;     // dia_chi
  phone: string;        // sdt
  image: string;        // hinh_anh
  condition: 'Moi' | 'Cu' | 'DaBan' | 'Khac'; // tinh_trang
  papers: boolean;      // giay_to == 'ChinhChu'
}

// URL Google Sheet (Updated)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=522785751&single=true&output=csv";

// Bộ lọc danh mục
const vehicleCategories = [
  { id: "all", name: "Tất cả", icon: <Filter size={18} /> },
  { id: "XeMay", name: "Xe Máy", icon: <Bike size={18} /> },
  { id: "Oto", name: "Ô tô", icon: <Car size={18} /> },
  { id: "XeTai", name: "Xe Tải/Ba Gác", icon: <Truck size={18} /> },
  { id: "NongNghiep", name: "Máy Cày/Ghe", icon: <Tractor size={18} /> },
];

const priceRanges = [
  { id: "all", name: "Mọi giá" },
  { id: "low", name: "Dưới 10Tr" },
  { id: "mid", name: "10Tr - 30Tr" },
  { id: "high", name: "Trên 30Tr" },
];

const VehiclePage: React.FC<VehiclePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: Format Price
  const formatPrice = (priceStr: string) => {
    const num = parseInt(priceStr.replace(/\D/g, ''));
    if (isNaN(num) || num === 0) return priceStr; // Giữ nguyên text nếu không phải số
    return num.toLocaleString('vi-VN') + 'đ';
  };

  // Parser CSV Custom (Thay thế PapaParse để nhẹ hơn mà vẫn hiệu quả)
  const parseCSV = (text: string): VehicleItem[] => {
    const rows = text.split('\n');
    const parseLine = (line: string): string[] => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return parts.map(part => {
            let p = part.trim();
            if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
            return p.replace(/""/g, '"');
        });
    };

    if (rows.length < 2) return [];

    const headers = parseLine(rows[0]);
    // Helper tìm index cột không phân biệt hoa thường
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    // Mapping columns based on user request
    const idxImage = getIndex(['hinh_anh', 'anh', 'image']);
    const idxTitle = getIndex(['tieu_de', 'ten_xe', 'title']);
    const idxPrice = getIndex(['gia_ban', 'gia', 'price']);
    const idxYear = getIndex(['nam_sx', 'nam', 'year']);
    const idxType = getIndex(['loai_xe', 'type']);
    const idxLocation = getIndex(['dia_chi', 'location']);
    const idxPhone = getIndex(['sdt', 'phone', 'contact']);
    const idxCondition = getIndex(['tinh_trang', 'condition']); // Moi, Cu, DaBan
    const idxPapers = getIndex(['giay_to', 'papers']); // ChinhChu

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawCondition = getCol(idxCondition);
            let conditionState: 'Moi' | 'Cu' | 'DaBan' | 'Khac' = 'Khac';
            
            // Normalize condition logic
            if (rawCondition.toLowerCase().includes('daban') || rawCondition.toLowerCase().includes('đã bán')) {
                conditionState = 'DaBan';
            } else if (rawCondition.toLowerCase().includes('moi') || rawCondition.toLowerCase() === 'new') {
                conditionState = 'Moi';
            } else if (rawCondition.toLowerCase().includes('cu') || rawCondition.toLowerCase().includes('old')) {
                conditionState = 'Cu';
            }

            const rawPapers = getCol(idxPapers).toLowerCase();
            const isChinhChu = rawPapers.includes('chinhchu') || rawPapers.includes('chính chủ');

            return {
                id: `veh-${index}`,
                title: getCol(idxTitle) || "Xe chưa cập nhật tên",
                price: formatPrice(getCol(idxPrice) || "Liên hệ"),
                type: getCol(idxType) || "Khac",
                year: getCol(idxYear) || "--",
                location: getCol(idxLocation) || "Thạnh Lợi",
                phone: getCol(idxPhone),
                image: getCol(idxImage) || "https://placehold.co/600x400?text=Xe+Thanh+Loi",
                condition: conditionState,
                papers: isChinhChu
            };
        });
    
    // Sắp xếp: Xe còn hàng lên trước, xe đã bán xuống cuối
    return parsed.sort((a, b) => {
        if (a.condition === 'DaBan' && b.condition !== 'DaBan') return 1;
        if (a.condition !== 'DaBan' && b.condition === 'DaBan') return -1;
        return 0;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const data = parseCSV(text);
        setVehicles(data);
      } catch (err) {
        console.error("Error:", err);
        // Fallback data if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredVehicles = vehicles.filter(item => {
    // 1. Category
    const matchCat = activeCategory === "all" || 
                     item.type.toLowerCase().includes(activeCategory.toLowerCase());
    
    // 2. Search
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Price Range
    let matchPrice = true;
    const priceNum = parseInt(item.price.replace(/\D/g, ''));
    if (!isNaN(priceNum) && priceNum > 0) {
        if (activePriceRange === "low") matchPrice = priceNum < 10000000;
        else if (activePriceRange === "mid") matchPrice = priceNum >= 10000000 && priceNum <= 30000000;
        else if (activePriceRange === "high") matchPrice = priceNum > 30000000;
    }

    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-100 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                Chợ Xe Thạnh Lợi
            </h1>
            <p className="text-xs text-gray-500 font-medium">Sàn mua bán xe Uy tín - Chính chủ</p>
        </div>
      </div>

      {/* 2. SMART FILTERS */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: Honda Vision, Máy cày Kubota..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Type Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {vehicleCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>

         {/* Price Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
            {priceRanges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => setActivePriceRange(range.id)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        activePriceRange === range.id
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
                    }`}
                >
                    {range.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. VEHICLE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-blue-600" size={24} />
                <p>Đang tải dữ liệu xe...</p>
            </div>
        )}

        {!isLoading && filteredVehicles.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <Bike size={48} className="mx-auto mb-3 opacity-20" />
                <p>Không tìm thấy xe phù hợp.</p>
            </div>
        )}

        {/* Responsive Grid: 2 columns mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredVehicles.map((item) => {
                const isSold = item.condition === 'DaBan';
                
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col relative group hover:shadow-xl transition-all duration-300 ${isSold ? 'grayscale opacity-75 pointer-events-none' : ''}`}
                    >
                        {/* IMAGE SECTION (4:3 Aspect Ratio) */}
                        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Xe+Thanh+Loi"; }}
                            />
                            
                            {/* OVERLAY ĐÃ BÁN */}
                            {isSold && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                    <span className="border-4 border-white text-white px-4 py-2 text-lg md:text-xl font-black uppercase -rotate-12 tracking-widest whitespace-nowrap">
                                        ĐÃ BÁN
                                    </span>
                                </div>
                            )}

                            {/* CONDITION BADGES */}
                            {!isSold && (
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    {item.condition === 'Moi' && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
                                            Xe Mới
                                        </span>
                                    )}
                                    {item.condition === 'Cu' && (
                                        <span className="bg-gray-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide">
                                            Qua Sử Dụng
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* VERIFIED BADGE */}
                            {!isSold && item.papers && (
                                <div className="absolute bottom-2 left-2 bg-green-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <ShieldCheck size={12} className="text-white" /> Giấy tờ đảm bảo
                                </div>
                            )}
                        </div>

                        {/* INFO SECTION */}
                        <div className="p-3 md:p-4 flex flex-col flex-grow">
                            {/* Title */}
                            <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug mb-2 line-clamp-2 h-[2.5em]">
                                {item.title}
                            </h3>
                            
                            {/* Badges Row (Year & Type) */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {item.year && item.year !== '--' && (
                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium border border-gray-200">
                                        <Calendar size={10} /> {item.year}
                                    </span>
                                )}
                                {item.type && (
                                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium border border-gray-200">
                                        <Tag size={10} /> {item.type}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mt-auto mb-3">
                                <p className={`font-black text-lg md:text-xl ${isSold ? 'text-gray-400 decoration-slate-400 line-through' : 'text-[#ff424e]'}`}>
                                    {item.price}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-2">
                                <MapPin size={12} className="text-gray-400"/>
                                <span className="truncate">{item.location}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-100"
                                    }`}
                                >
                                    <Phone size={14} /> Gọi Bán
                                </a>
                                <a 
                                    href={isSold ? undefined : `https://zalo.me/${item.phone}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className={`flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-100"
                                    }`}
                                >
                                    <MessageCircle size={14} /> Zalo
                                </a>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

    </div>
  );
};

export default VehiclePage;

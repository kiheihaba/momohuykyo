
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShieldCheck,
  Tag,
  RefreshCw,
  Zap,
  X,
  Ship,
  Info,
  ChevronRight
} from 'lucide-react';

interface VehiclePageProps {
  onBack: () => void;
}

interface VehicleItem {
  id: string;
  title: string;        // ten_xe
  price: string;        // gia_tien
  priceValue: number;   // gia_tri_so
  type: string;         // loai_xe
  year: string;         // nam_sx
  cc: string;           // phan_khoi
  location: string;     // dia_chi
  phone: string;        // sdt
  image: string;        // hinh_anh
  condition: string;    // tinh_trang (Mới 99%, Cũ...)
  isOwner: boolean;     // giay_to == 'ChinhChu'
  description: string;  // mo_ta
  status: 'ConHang' | 'DaBan'; 
}

// URL Google Sheet
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=522785751&single=true&output=csv";

// Bộ lọc danh mục
const vehicleCategories = [
  { id: "all", name: "Tất cả", icon: <Filter size={16} /> },
  { id: "xe_may", name: "Xe Máy", icon: <Bike size={16} /> },
  { id: "oto", name: "Ô tô/Tải", icon: <Car size={16} /> },
  { id: "ghe_xuong", name: "Ghe Xuồng", icon: <Ship size={16} /> },
  { id: "may_nong_nghiep", name: "Máy Nông Nghiệp", icon: <Tractor size={16} /> },
];

const priceRanges = [
  { id: "all", name: "Mọi giá" },
  { id: "under_10", name: "< 10 Triệu" },
  { id: "10_30", name: "10 - 30 Triệu" },
  { id: "over_30", name: "> 30 Triệu" },
];

const VehiclePage: React.FC<VehiclePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);

  // Helper: Parse Price Value
  const parsePrice = (str: string) => {
      const num = parseInt(str.replace(/\D/g, ''));
      return isNaN(num) ? 0 : num;
  };

  // Parser CSV
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
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    // Map Columns
    const idxImage = getIndex(['hinh_anh', 'anh', 'image']);
    const idxTitle = getIndex(['ten_xe', 'tieu_de', 'title']);
    const idxPrice = getIndex(['gia_tien', 'gia_ban', 'price']);
    const idxYear = getIndex(['nam_sx', 'nam', 'year']);
    const idxCC = getIndex(['phan_khoi', 'cc', 'dung_tich']);
    const idxType = getIndex(['loai_xe', 'type', 'category']);
    const idxLocation = getIndex(['dia_chi', 'khu_vuc', 'location']);
    const idxPhone = getIndex(['sdt', 'phone', 'contact']);
    const idxCondition = getIndex(['tinh_trang', 'condition']); 
    const idxPapers = getIndex(['giay_to', 'papers']); 
    const idxDesc = getIndex(['mo_ta', 'description']);
    const idxStatus = getIndex(['trang_thai', 'status']); // ConHang / DaBan

    const parsedData = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index): VehicleItem => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const priceStr = getCol(idxPrice) || "Liên hệ";
            const papersStr = getCol(idxPapers).toLowerCase();
            const isOwner = papersStr.includes('chinh') || papersStr.includes('chu') || papersStr.includes('ok');
            const statusStr = getCol(idxStatus).toLowerCase();
            const isSold = statusStr.includes('ban') || statusStr.includes('sold');

            return {
                id: `veh-${index}`,
                title: getCol(idxTitle) || "Xe chưa cập nhật tên",
                price: priceStr,
                priceValue: parsePrice(priceStr),
                type: getCol(idxType) || "Khac",
                year: getCol(idxYear) || "--",
                cc: getCol(idxCC) || "--",
                location: getCol(idxLocation) || "Thạnh Lợi",
                phone: getCol(idxPhone),
                image: getCol(idxImage) || "https://placehold.co/600x400/333/FFF?text=Xe+Thanh+Loi",
                condition: getCol(idxCondition) || "Đã sử dụng",
                isOwner: isOwner,
                description: getCol(idxDesc) || "Liên hệ người bán để biết thêm chi tiết về tình trạng xe.",
                status: (isSold ? 'DaBan' : 'ConHang') as 'ConHang' | 'DaBan'
            };
        });
    
    // Fisher-Yates Shuffle
    for (let i = parsedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [parsedData[i], parsedData[j]] = [parsedData[j], parsedData[i]];
    }

    // Sort: Còn hàng lên trước (nhưng ngẫu nhiên trong nhóm còn hàng)
    return parsedData.sort((a, b) => {
        if (a.status === 'DaBan' && b.status !== 'DaBan') return 1;
        if (a.status !== 'DaBan' && b.status === 'DaBan') return -1;
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredVehicles = vehicles.filter(item => {
    // 1. Category Filter (Fuzzy match)
    const typeLower = item.type.toLowerCase();
    let matchCat = true;
    if (activeCategory !== 'all') {
        if (activeCategory === 'xe_may') matchCat = typeLower.includes('máy') || typeLower.includes('moto');
        else if (activeCategory === 'oto') matchCat = typeLower.includes('oto') || typeLower.includes('tải') || typeLower.includes('car');
        else if (activeCategory === 'ghe_xuong') matchCat = typeLower.includes('ghe') || typeLower.includes('xuồng') || typeLower.includes('thuyền');
        else if (activeCategory === 'may_nong_nghiep') matchCat = typeLower.includes('cày') || typeLower.includes('xới') || typeLower.includes('gặt');
    }
    
    // 2. Search
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Price Range
    let matchPrice = true;
    const val = item.priceValue;
    if (val > 0) {
        if (activePriceRange === "under_10") matchPrice = val < 10000000;
        else if (activePriceRange === "10_30") matchPrice = val >= 10000000 && val <= 30000000;
        else if (activePriceRange === "over_30") matchPrice = val > 30000000;
    }

    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-200">
      
      {/* 1. HEADER (Dark Carbon) */}
      <div className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white flex items-center gap-2 uppercase tracking-wide italic">
                CHỢ XE <span className="text-[#FF3D00]">TỐC ĐỘ</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Automotive Market</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER (Sticky) */}
      <div className="sticky top-16 z-40 bg-[#121212] pb-4 pt-4 px-4 border-b border-gray-800 shadow-2xl">
         {/* Search */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm kiếm: Vision 2022, Xe tải Kia..." 
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] transition-all font-medium uppercase tracking-wide"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3D00]" size={18} />
         </div>

         {/* Categories */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
            {vehicleCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg skew-x-[-10deg] border text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wider ${
                        activeCategory === cat.id 
                        ? "bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.4)]" 
                        : "bg-[#1E1E1E] text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                    }`}
                >
                   <span className="skew-x-[10deg] flex items-center gap-2">{cat.icon} {cat.name}</span>
                </button>
            ))}
         </div>

         {/* Price Range */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {priceRanges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => setActivePriceRange(range.id)}
                    className={`whitespace-nowrap px-3 py-1 rounded-sm text-[10px] font-bold border transition-colors uppercase tracking-widest ${
                        activePriceRange === range.id
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600"
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
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-[#FF3D00]" size={32} />
                <p>Đang tải dữ liệu xe...</p>
            </div>
        )}

        {!isLoading && filteredVehicles.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <Car size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy xe phù hợp.</p>
                <button onClick={() => {setActiveCategory('all'); setActivePriceRange('all');}} className="mt-4 text-[#FF3D00] text-sm uppercase font-bold hover:underline">
                    Xóa bộ lọc
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((item, index) => {
                const isSold = item.status === 'DaBan';

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden flex flex-col hover:border-[#FF3D00]/50 hover:shadow-[0_0_20px_rgba(255,61,0,0.15)] transition-all duration-300 ${isSold ? 'opacity-50 grayscale' : ''}`}
                    >
                        {/* THUMBNAIL SECTION (16:9) */}
                        <div className="relative aspect-video bg-black overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a1a1a/333?text=Xe+Thanh+Loi"; }}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80"></div>

                            {/* STATUS BADGE (Top Left) */}
                            <div className="absolute top-0 left-0">
                                <span className="inline-block bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-br-lg border-b border-r border-gray-700 uppercase tracking-wider">
                                    {isSold ? 'ĐÃ BÁN' : item.condition}
                                </span>
                            </div>

                            {/* VERIFIED BADGE (Top Right) */}
                            {item.isOwner && !isSold && (
                                <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded skew-x-[-10deg] shadow-lg flex items-center gap-1 uppercase">
                                    <div className="skew-x-[10deg] flex items-center gap-1">
                                        <ShieldCheck size={12} /> Chính chủ
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* INFO BODY */}
                        <div className="p-5 flex flex-col flex-grow relative z-10 -mt-2">
                            {/* Title */}
                            <h3 className="text-xl font-black text-white uppercase leading-none mb-1 line-clamp-2 min-h-[2.5em] group-hover:text-[#FF3D00] transition-colors">
                                {item.title}
                            </h3>

                            {/* Price (Neon Red) */}
                            <div className="mb-4">
                                <span className="text-[#FF3D00] font-black text-2xl tracking-tighter drop-shadow-[0_0_8px_rgba(255,61,0,0.4)]">
                                    {item.price}
                                </span>
                            </div>

                            {/* Specs Row */}
                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-b border-gray-800 py-3 mb-4">
                                <div className="flex flex-col items-center flex-1 border-r border-gray-800">
                                    <Calendar size={14} className="mb-1 text-gray-500" />
                                    <span className="font-bold text-gray-300">{item.year}</span>
                                </div>
                                <div className="flex flex-col items-center flex-1 border-r border-gray-800">
                                    <Gauge size={14} className="mb-1 text-gray-500" />
                                    <span className="font-bold text-gray-300">{item.cc !== '--' ? item.cc : item.type}</span>
                                </div>
                                <div className="flex flex-col items-center flex-1">
                                    <MapPin size={14} className="mb-1 text-gray-500" />
                                    <span className="font-bold text-gray-300 truncate max-w-[80px]">{item.location}</span>
                                </div>
                            </div>

                            {/* ACTION FOOTER */}
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button 
                                    onClick={() => setSelectedVehicle(item)}
                                    className="bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-white py-3 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all"
                                >
                                    <Info size={16} /> Xem Chi Tiết
                                </button>
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`py-3 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                                        isSold
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        : "bg-[#00C853] text-white hover:bg-[#00E676] hover:shadow-[0_0_15px_rgba(0,200,83,0.4)]"
                                    }`}
                                >
                                    <Phone size={16} fill="currentColor" /> Gọi Bán
                                </a>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

      {/* 4. DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedVehicle && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedVehicle(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-[#1a1a1a] w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Image */}
                    <div className="relative aspect-video bg-black">
                        <img 
                            src={selectedVehicle.image} 
                            alt={selectedVehicle.title} 
                            className="w-full h-full object-contain"
                        />
                        <button 
                            onClick={() => setSelectedVehicle(null)}
                            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="bg-[#FF3D00] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                 {selectedVehicle.condition}
                             </span>
                             {selectedVehicle.isOwner && (
                                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                    Chính chủ
                                </span>
                             )}
                        </div>

                        <h2 className="text-2xl font-black text-white uppercase leading-tight mb-2">
                            {selectedVehicle.title}
                        </h2>

                        <p className="text-[#FF3D00] text-3xl font-black tracking-tighter mb-6">
                            {selectedVehicle.price}
                        </p>

                        <div className="bg-[#252525] p-4 rounded-lg border border-gray-700 mb-6">
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-3">Thông số xe</h4>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Năm sản xuất</span>
                                    <span className="text-white font-bold">{selectedVehicle.year}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Phân khối/Loại</span>
                                    <span className="text-white font-bold">{selectedVehicle.cc}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Khu vực</span>
                                    <span className="text-white font-bold">{selectedVehicle.location}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs">Tình trạng</span>
                                    <span className="text-white font-bold">{selectedVehicle.condition}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-2">Mô tả chi tiết</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {selectedVehicle.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <a 
                                href={`tel:${selectedVehicle.phone}`}
                                className="bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Phone size={18} fill="currentColor" /> Gọi ngay
                            </a>
                            <a 
                                href={`https://zalo.me/${selectedVehicle.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-lg"
                            >
                                <MessageCircle size={18} /> Chat Zalo
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

export default VehiclePage;

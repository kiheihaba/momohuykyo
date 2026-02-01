
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
  Ship,
  Filter,
  Calendar,
  Gauge,
  ShieldCheck,
  Tag,
  RefreshCw,
  X,
  Info,
  CheckCircle2
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
  condition: 'Mới' | 'Cũ' | 'Đã Bán' | 'Độ'; // tinh_trang
  papers: boolean;      // giay_to == 'ChinhChu'
  description?: string; // mo_ta (Added field for modal)
  priceValue: number;   // For sorting/filtering
}

// URL Google Sheet
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=522785751&single=true&output=csv";

// Bộ lọc danh mục
const vehicleCategories = [
  { id: "all", name: "Tất cả", icon: <Filter size={18} /> },
  { id: "XeMay", name: "Xe Máy", icon: <Bike size={18} /> },
  { id: "Oto", name: "Ô tô/Tải", icon: <Car size={18} /> },
  { id: "GheXuong", name: "Ghe Xuồng", icon: <Ship size={18} /> },
  { id: "NongNghiep", name: "Máy Nông Nghiệp", icon: <Tractor size={18} /> },
];

const priceRanges = [
  { id: "all", name: "Mọi mức giá" },
  { id: "low", name: "< 10 Triệu" },
  { id: "mid", name: "10 - 30 Triệu" },
  { id: "high", name: "> 30 Triệu" },
];

const VehiclePage: React.FC<VehiclePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);

  // Helper: Format Price
  const formatPrice = (priceStr: string) => {
    const num = parseInt(priceStr.replace(/\D/g, ''));
    if (isNaN(num) || num === 0) return "Liên hệ"; 
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace('.0', '') + ' Tỷ';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + ' Tr';
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const parsePrice = (priceStr: string) => {
      return parseInt(priceStr.replace(/\D/g, '')) || 0;
  }

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

    // Mapping columns
    const idxImage = getIndex(['hinh_anh', 'anh', 'image']);
    const idxTitle = getIndex(['tieu_de', 'ten_xe', 'title']);
    const idxPrice = getIndex(['gia_ban', 'gia', 'price']);
    const idxYear = getIndex(['nam_sx', 'nam', 'year']);
    const idxType = getIndex(['loai_xe', 'type', 'phan_loai']);
    const idxLocation = getIndex(['dia_chi', 'location']);
    const idxPhone = getIndex(['sdt', 'phone', 'contact']);
    const idxCondition = getIndex(['tinh_trang', 'condition']); 
    const idxPapers = getIndex(['giay_to', 'papers']);
    const idxDesc = getIndex(['mo_ta', 'description', 'chi_tiet']);

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawCondition = getCol(idxCondition).toLowerCase();
            let conditionState: 'Mới' | 'Cũ' | 'Đã Bán' | 'Độ' = 'Cũ';
            
            if (rawCondition.includes('daban') || rawCondition.includes('đã bán')) conditionState = 'Đã Bán';
            else if (rawCondition.includes('moi') || rawCondition.includes('new') || rawCondition.includes('99')) conditionState = 'Mới';
            else if (rawCondition.includes('do') || rawCondition.includes('kieng')) conditionState = 'Độ';

            const rawPapers = getCol(idxPapers).toLowerCase();
            const isChinhChu = rawPapers.includes('chinhchu') || rawPapers.includes('chính chủ') || rawPapers.includes('hqcn');

            return {
                id: `veh-${index}`,
                title: getCol(idxTitle) || "Xe chưa cập nhật tên",
                price: formatPrice(getCol(idxPrice)),
                priceValue: parsePrice(getCol(idxPrice)),
                type: getCol(idxType) || "Khac",
                year: getCol(idxYear) || "---",
                location: getCol(idxLocation) || "Thạnh Lợi",
                phone: getCol(idxPhone),
                image: getCol(idxImage) || "https://placehold.co/800x450/333/FFF?text=No+Image",
                condition: conditionState,
                papers: isChinhChu,
                description: getCol(idxDesc) || "Liên hệ người bán để biết thêm chi tiết về tình trạng xe."
            };
        });
    
    // Sắp xếp: Xe còn hàng lên trước
    return parsed.sort((a, b) => {
        if (a.condition === 'Đã Bán' && b.condition !== 'Đã Bán') return 1;
        if (a.condition !== 'Đã Bán' && b.condition === 'Đã Bán') return -1;
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
    // 1. Category
    let matchCat = true;
    const iType = item.type.toLowerCase();
    const aCat = activeCategory.toLowerCase();
    
    if (activeCategory !== 'all') {
       if (activeCategory === 'XeMay') matchCat = iType.includes('xe máy') || iType.includes('moto') || iType.includes('honda') || iType.includes('yamaha');
       else if (activeCategory === 'Oto') matchCat = iType.includes('ô tô') || iType.includes('car') || iType.includes('tải') || iType.includes('du lịch');
       else if (activeCategory === 'GheXuong') matchCat = iType.includes('ghe') || iType.includes('xuồng') || iType.includes('vỏ');
       else if (activeCategory === 'NongNghiep') matchCat = iType.includes('cày') || iType.includes('xới') || iType.includes('cắt');
    }

    // 2. Search
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Price Range
    let matchPrice = true;
    if (activePriceRange === "low") matchPrice = item.priceValue < 10000000;
    else if (activePriceRange === "mid") matchPrice = item.priceValue >= 10000000 && item.priceValue <= 30000000;
    else if (activePriceRange === "high") matchPrice = item.priceValue > 30000000;

    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-200">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-xl border-b border-gray-800 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white uppercase tracking-wide flex items-center gap-2">
                CHỢ XE <span className="text-[#FF3D00]">TỐC ĐỘ</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sàn giao dịch Thạnh Lợi</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER (Dark Carbon Style) */}
      <div className="bg-[#181818] pb-4 px-4 pt-4 shadow-xl sticky top-16 z-40 border-b border-gray-800">
         {/* Search */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm xe: Exciter, Vario, Máy cày..." 
                className="w-full bg-[#252525] border border-[#333] rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3D00] transition-colors" size={18} />
         </div>

         {/* Type Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {vehicleCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-[#FF3D00] text-black border-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.4)]" 
                        : "bg-[#252525] text-gray-400 border-[#333] hover:border-gray-500 hover:text-white"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>

         {/* Price Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {priceRanges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => setActivePriceRange(range.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all border ${
                        activePriceRange === range.id
                        ? "bg-white/10 text-white border-white/30"
                        : "bg-transparent text-gray-600 border-[#333] hover:border-gray-600"
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
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!isLoading && filteredVehicles.map((item) => {
                const isSold = item.condition === 'Đã Bán';
                
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={!isSold ? { y: -5, borderColor: '#FF3D00', boxShadow: '0 0 20px rgba(255,61,0,0.2)' } : {}}
                        className={`bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333] flex flex-col relative transition-all duration-300 group ${isSold ? 'opacity-50 grayscale' : ''}`}
                    >
                        {/* THUMBNAIL (16:9 Aspect Ratio) */}
                        <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => !isSold && setSelectedVehicle(item)}>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x450/333/FFF?text=Xe+Thanh+Loi"; }}
                            />
                            
                            {/* OVERLAY ĐÃ BÁN */}
                            {isSold && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                                    <span className="border-4 border-white text-white px-6 py-2 text-2xl font-black uppercase -rotate-12 tracking-widest whitespace-nowrap">
                                        ĐÃ BÁN
                                    </span>
                                </div>
                            )}

                            {/* CONDITION BADGE (Top Left) */}
                            {!isSold && (
                                <div className="absolute top-0 left-0 bg-black/80 backdrop-blur-md border-r border-b border-white/10 px-3 py-1 rounded-br-xl z-10">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                                        item.condition === 'Mới' ? 'text-brand-cyan' : 'text-gray-300'
                                    }`}>
                                        {item.condition}
                                    </span>
                                </div>
                            )}

                            {/* VERIFIED BADGE (Top Right) */}
                            {!isSold && item.papers && (
                                <div className="absolute top-2 right-2 bg-green-900/80 backdrop-blur-sm text-green-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-500/30">
                                    <ShieldCheck size={12} /> Chính Chủ
                                </div>
                            )}
                        </div>

                        {/* INFO BODY */}
                        <div className="p-4 flex flex-col flex-grow relative bg-[#1E1E1E]">
                            {/* Decorative Line */}
                            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                            {/* Title */}
                            <h3 
                                className="font-bold text-white text-lg leading-tight mb-2 line-clamp-1 cursor-pointer hover:text-[#FF3D00] transition-colors"
                                onClick={() => !isSold && setSelectedVehicle(item)}
                            >
                                {item.title}
                            </h3>
                            
                            {/* Price */}
                            <div className="mb-4">
                                <p className={`font-black text-2xl tracking-tight ${isSold ? 'text-gray-500 line-through' : 'text-[#FF3D00] drop-shadow-[0_0_8px_rgba(255,61,0,0.4)]'}`}>
                                    {item.price}
                                </p>
                            </div>

                            {/* Specs Row */}
                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium bg-[#151515] p-2 rounded mb-4 border border-[#333]">
                                <span>{item.year}</span>
                                <span className="text-gray-700">|</span>
                                <span className="truncate max-w-[80px]">{item.type}</span>
                                <span className="text-gray-700">|</span>
                                <span className="truncate max-w-[80px] text-gray-400">{item.location}</span>
                            </div>

                            {/* ACTION FOOTER */}
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase transition-all clip-path-slant ${
                                        isSold 
                                        ? "bg-[#333] text-gray-500 cursor-not-allowed" 
                                        : "bg-green-600 text-black hover:bg-green-500"
                                    }`}
                                >
                                    <Phone size={16} fill="currentColor" /> Gọi Mua
                                </a>
                                <button
                                    onClick={() => !isSold && setSelectedVehicle(item)}
                                    className={`flex items-center justify-center gap-2 py-3 rounded text-xs font-bold uppercase transition-all border ${
                                        isSold
                                        ? "border-[#333] text-gray-600 cursor-not-allowed"
                                        : "bg-transparent border-gray-600 text-gray-300 hover:border-white hover:text-white"
                                    }`}
                                >
                                    <Info size={16} /> Chi tiết
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

      {/* 4. DETAIL MODAL */}
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
                    className="bg-[#1a1a1a] w-full max-w-lg rounded-xl border border-gray-700 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Image */}
                    <div className="relative aspect-video w-full bg-black">
                         <img 
                             src={selectedVehicle.image} 
                             alt={selectedVehicle.title} 
                             className="w-full h-full object-contain"
                         />
                         <button 
                             onClick={() => setSelectedVehicle(null)}
                             className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-[#FF3D00] transition-colors"
                         >
                             <X size={20} />
                         </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight mb-1">{selectedVehicle.title}</h2>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <MapPin size={14} /> {selectedVehicle.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#FF3D00] font-black text-2xl drop-shadow-[0_0_10px_rgba(255,61,0,0.4)]">
                                    {selectedVehicle.price}
                                </p>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-[#252525] p-4 rounded-lg border border-[#333]">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Năm Sản Xuất</p>
                                <p className="text-white font-semibold">{selectedVehicle.year}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Loại Xe</p>
                                <p className="text-white font-semibold">{selectedVehicle.type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Tình Trạng</p>
                                <p className="text-white font-semibold">{selectedVehicle.condition}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Giấy Tờ</p>
                                <p className={`${selectedVehicle.papers ? 'text-green-500' : 'text-gray-400'} font-semibold flex items-center gap-1`}>
                                    {selectedVehicle.papers ? <><CheckCircle2 size={14}/> Chính chủ</> : 'Không xác định'}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h4 className="text-white font-bold uppercase text-sm mb-2 border-l-2 border-[#FF3D00] pl-3">Thông tin chi tiết</h4>
                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                {selectedVehicle.description}
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-[#151515] border-t border-[#333] grid grid-cols-2 gap-4">
                        <a 
                            href={`tel:${selectedVehicle.phone}`}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold uppercase text-sm py-3 rounded flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all"
                        >
                            <Phone size={18} fill="currentColor" /> Gọi Ngay
                        </a>
                        <a 
                            href={`https://zalo.me/${selectedVehicle.phone}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-sm py-3 rounded flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
                        >
                            <MessageCircle size={18} /> Chat Zalo
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VehiclePage;

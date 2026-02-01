
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Home,
  Trees, 
  Wheat,
  Key,
  Ruler,
  CheckCircle2,
  Camera,
  Plus,
  RefreshCw,
  AlertCircle,
  Filter,
  DollarSign,
  Maximize2,
  X,
  ChevronRight,
  LandPlot
} from 'lucide-react';

interface RealEstatePageProps {
  onBack: () => void;
}

interface PropertyItem {
  id: string;
  title: string;        // tieu_de
  price: string;        // gia_tien
  priceValue: number;   // Giá trị số để lọc
  area: string;         // dien_tich
  location: string;     // vi_tri
  type: string;         // loai_bds
  image: string;        // hinh_anh
  description: string;  // mo_ta
  isVerified: boolean;  // xac_thuc == 'Verified'
  contact: string;      // sdt_lien_he
}

// 1. NGUỒN DỮ LIỆU
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=318672864&single=true&output=csv";

// Danh mục BĐS (Filter)
const categories = [
  { id: "all", name: "Tất cả", icon: <Filter size={14} /> },
  { id: "dat_nen", name: "Đất Nền", icon: <Trees size={14} /> },
  { id: "nha_o", name: "Nhà Ở", icon: <Home size={14} /> },
  { id: "dat_ruong", name: "Đất Ruộng/Vườn", icon: <Wheat size={14} /> },
  { id: "cho_thue", name: "Cho Thuê", icon: <Key size={14} /> },
];

// Bộ lọc giá
const priceFilters = [
  { id: "all", name: "Mọi mức giá" },
  { id: "under_500", name: "< 500 Triệu" },
  { id: "500_1b", name: "500Tr - 1 Tỷ" },
  { id: "over_1b", name: "> 1 Tỷ" },
];

const RealEstatePage: React.FC<RealEstatePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePrice, setActivePrice] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);

  // Helper: Chuyển đổi giá text sang số để lọc (Ước lượng)
  const parsePriceValue = (priceStr: string): number => {
    const s = priceStr.toLowerCase().replace(/,/g, '.');
    const num = parseFloat(s.match(/[\d\.]+/)?.[0] || "0");
    
    if (s.includes('tỷ') || s.includes('ty')) return num * 1000000000;
    if (s.includes('tr') || s.includes('triệu')) return num * 1000000;
    if (s.includes('ngàn') || s.includes('k')) return num * 1000;
    return 0; // Thỏa thuận hoặc không xác định
  };

  // 2. PARSE CSV DATA
  const parseCSV = (text: string): PropertyItem[] => {
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

    // Mapping Columns
    const idxImage = getIndex(['hinh_anh', 'anh', 'image']);
    const idxTitle = getIndex(['tieu_de', 'ten_tin', 'title']);
    const idxPrice = getIndex(['gia_tien', 'gia', 'price']);
    const idxArea = getIndex(['dien_tich', 'area']);
    const idxLocation = getIndex(['vi_tri', 'dia_chi', 'location']);
    const idxType = getIndex(['loai_bds', 'loai', 'type']);
    const idxContact = getIndex(['sdt_lien_he', 'sdt', 'phone']);
    const idxVerified = getIndex(['xac_thuc', 'verified', 'status']);
    const idxDesc = getIndex(['mo_ta', 'chi_tiet', 'description']);

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawVerified = getCol(idxVerified).toLowerCase();
            const isVerified = rawVerified.includes('verified') || rawVerified.includes('ok') || rawVerified.includes('xac thuc');
            const priceStr = getCol(idxPrice) || "Thỏa thuận";

            return {
                id: `bds-${index}`,
                title: getCol(idxTitle) || "Bất động sản Thạnh Lợi",
                price: priceStr,
                priceValue: parsePriceValue(priceStr),
                area: getCol(idxArea) || "-- m²",
                location: getCol(idxLocation) || "Thạnh Lợi",
                type: getCol(idxType) || "Đất nền",
                image: getCol(idxImage) || "https://placehold.co/600x400/1a1a1a/FFF?text=Nha+Dat",
                description: getCol(idxDesc) || "Liên hệ trực tiếp để biết thêm thông tin chi tiết về bất động sản này.",
                contact: getCol(idxContact),
                isVerified: isVerified
            };
        });
    
    // Ưu tiên tin đã xác thực lên đầu
    return parsed.sort((a, b) => (Number(b.isVerified) - Number(a.isVerified)));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Không tải được dữ liệu");
        const text = await response.text();
        const data = parseCSV(text);
        setProperties(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Đang cập nhật dữ liệu nhà đất...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. LOGIC FILTER
  const filteredProperties = properties.filter(item => {
    // Filter Category
    let matchesCategory = true;
    const typeLower = item.type.toLowerCase();
    
    if (activeCategory === "dat_ruong") matchesCategory = typeLower.includes("ruộng") || typeLower.includes("lúa") || typeLower.includes("vườn") || typeLower.includes("nông");
    else if (activeCategory === "nha_o") matchesCategory = typeLower.includes("nhà");
    else if (activeCategory === "dat_nen") matchesCategory = typeLower.includes("nền") || typeLower.includes("thổ");
    else if (activeCategory === "cho_thue") matchesCategory = typeLower.includes("thuê");

    // Filter Price
    let matchesPrice = true;
    if (activePrice === "under_500") matchesPrice = item.priceValue > 0 && item.priceValue < 500000000;
    else if (activePrice === "500_1b") matchesPrice = item.priceValue >= 500000000 && item.priceValue <= 1000000000;
    else if (activePrice === "over_1b") matchesPrice = item.priceValue > 1000000000;

    // Filter Search
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a] overflow-y-auto overflow-x-hidden custom-scrollbar text-white font-sans">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
            <button 
                onClick={onBack}
                className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="font-black text-lg leading-none text-white flex items-center gap-2 uppercase tracking-wide">
                    Nhà Đất <span className="text-brand-cyan">Thạnh Lợi</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Premium Real Estate</p>
            </div>
        </div>
        <div className="bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan p-2 rounded-lg">
            <LandPlot size={20} />
        </div>
      </div>

      {/* 2. SEARCH & FILTER (Sticky) */}
      <div className="sticky top-16 z-40 bg-[#0a0a0a]/95 backdrop-blur-md pb-4 pt-4 px-4 border-b border-white/5 shadow-2xl">
         {/* Search Input */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm kiếm: Đất vườn, Nhà mặt tiền..." 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-cyan transition-colors" size={18} />
         </div>

         {/* Filter Categories */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wider ${
                        activeCategory === cat.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>

         {/* Price Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
             {priceFilters.map((pf) => (
                 <button
                    key={pf.id}
                    onClick={() => setActivePrice(pf.id)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        activePrice === pf.id
                        ? "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50"
                        : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600"
                    }`}
                 >
                     {pf.name}
                 </button>
             ))}
         </div>
      </div>

      {/* 4. PROPERTY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tải dữ liệu...</p>
            </div>
        )}

        {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <Home size={48} className="mx-auto mb-4 opacity-20" />
                <p>Chưa có tin đăng nào phù hợp.</p>
                <button onClick={() => {setActiveCategory('all'); setActivePrice('all');}} className="mt-4 text-brand-cyan text-sm uppercase font-bold hover:underline">
                    Xóa bộ lọc
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((item, index) => (
                <React.Fragment key={item.id}>
                    {/* AD BANNER (Inject at index 2) */}
                    {index === 2 && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-2 bg-gradient-to-r from-[#1a1a1a] to-black rounded-2xl p-1 border border-brand-cyan/30 relative overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="relative z-10 p-6 flex-1 flex flex-col justify-center items-start">
                                <div className="inline-flex items-center gap-2 bg-brand-cyan text-black text-[10px] font-black px-2 py-1 rounded uppercase mb-3">
                                    <Camera size={12} /> Premium Service
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase leading-none mb-2">
                                    Quay Flycam <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500">Bất động sản</span>
                                </h3>
                                <p className="text-gray-400 text-xs mb-4 max-w-xs">
                                    Nâng tầm giá trị lô đất với góc quay từ trên cao. Chốt sale nhanh gấp 3 lần.
                                </p>
                                <button className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-brand-cyan transition-colors shadow-lg clip-path-slant uppercase tracking-wider">
                                    Booking Ngay
                                </button>
                            </div>
                            <div className="w-full md:w-1/2 h-32 md:h-auto relative overflow-hidden rounded-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=600" 
                                    alt="Drone" 
                                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-transparent"></div>
                            </div>
                        </motion.div>
                    )}

                    {/* PROPERTY CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="group bg-[#1a1a1a]/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300 flex flex-col h-full"
                    >
                        {/* THUMBNAIL (60% Height idea adjusted to Aspect Ratio) */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#000]">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80"></div>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded border border-white/10 uppercase tracking-wide">
                                {item.type}
                            </div>
                            
                            {item.isVerified && (
                                <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.4)] uppercase">
                                    <CheckCircle2 size={10} fill="currentColor" className="text-white" />
                                    Đã kiểm duyệt
                                </div>
                            )}
                        </div>

                        {/* INFO BODY */}
                        <div className="p-5 flex flex-col flex-grow relative -mt-6 z-10">
                            <h3 className="font-bold text-white text-lg leading-snug line-clamp-2 mb-3 min-h-[3.5em] group-hover:text-brand-cyan transition-colors">
                                {item.title}
                            </h3>
                            
                            {/* Price & Area */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[#FFD700] font-black text-xl drop-shadow-sm truncate pr-2">
                                    {item.price}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold bg-white/5 px-2 py-1 rounded">
                                    <Ruler size={12} /> {item.area}
                                </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                                <MapPin size={14} className="text-brand-cyan shrink-0" />
                                <span className="truncate">{item.location}</span>
                            </div>

                            {/* ACTION FOOTER */}
                            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                 <button 
                                    onClick={() => setSelectedProperty(item)}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase hover:bg-white hover:text-black transition-all"
                                 >
                                    Xem chi tiết
                                 </button>
                                 <a 
                                    href={`tel:${item.contact}`}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] md:text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                                 >
                                    <Phone size={14} fill="currentColor" /> Liên hệ
                                 </a>
                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
            ))}
        </div>
      </div>

      {/* 5. DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedProperty && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedProperty(null)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#121212] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-gray-700 overflow-hidden flex flex-col relative shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => setSelectedProperty(null)}
                        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Section (Large) */}
                    <div className="relative w-full h-64 md:h-80 bg-black shrink-0">
                         <img 
                            src={selectedProperty.image} 
                            alt={selectedProperty.title} 
                            className="w-full h-full object-cover"
                         />
                         <div className="absolute bottom-4 left-4 flex gap-2">
                             <span className="bg-brand-cyan text-black text-xs font-bold px-3 py-1 rounded uppercase shadow-lg">
                                 {selectedProperty.type}
                             </span>
                             {selectedProperty.isVerified && (
                                 <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded uppercase shadow-lg flex items-center gap-1">
                                     <CheckCircle2 size={12} fill="currentColor" /> Đã kiểm duyệt
                                 </span>
                             )}
                         </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-2">
                            {selectedProperty.title}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6 pb-6 border-b border-gray-800">
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mức giá</p>
                                 <p className="text-[#FFD700] text-2xl font-black">{selectedProperty.price}</p>
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Diện tích</p>
                                 <p className="text-white text-xl font-bold flex items-center gap-1">
                                     <Ruler size={18} className="text-gray-400" /> {selectedProperty.area}
                                 </p>
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vị trí</p>
                                 <p className="text-white text-sm font-semibold flex items-center gap-1">
                                     <MapPin size={16} className="text-brand-cyan" /> {selectedProperty.location}
                                 </p>
                             </div>
                        </div>

                        <div className="mb-8">
                             <h3 className="text-brand-cyan font-bold uppercase text-sm mb-3">Thông tin chi tiết</h3>
                             <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                 {selectedProperty.description}
                             </p>
                        </div>

                        {/* Flycam Ad Footer */}
                        <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5 flex items-center justify-center gap-2 mb-6">
                            <Camera size={16} className="text-gray-500" />
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                Hình ảnh này được thực hiện bởi dịch vụ Flycam Momo x HuyKyo
                            </p>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] flex gap-3 shrink-0">
                        <a 
                            href={`tel:${selectedProperty.contact}`}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                        >
                            <Phone size={18} fill="currentColor" /> Liên hệ Chủ Đất
                        </a>
                        <a 
                            href={`https://zalo.me/${selectedProperty.contact}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="w-16 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
                        >
                            <MessageCircle size={24} />
                        </a>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Post Button */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center text-black z-50 border-4 border-black font-bold"
      >
          <Plus size={28} />
      </motion.a>

    </div>
  );
};

export default RealEstatePage;

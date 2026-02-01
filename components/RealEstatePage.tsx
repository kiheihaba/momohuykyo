
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
  Maximize2,
  X,
  DollarSign
} from 'lucide-react';

interface RealEstatePageProps {
  onBack: () => void;
}

interface PropertyItem {
  id: string;
  title: string;        // tieu_de
  price: string;        // gia_tien
  area: string;         // dien_tich
  location: string;     // vi_tri
  type: string;         // loai_bds
  image: string;        // hinh_anh
  description: string;  // mo_ta
  isVerified: boolean;  // xac_thuc == 'Verified'
  contact: string;      // sdt_lien_he
  priceValue: number;   // Giá trị số để lọc
}

// 1. NGUỒN DỮ LIỆU
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=318672864&single=true&output=csv";

// Danh mục BĐS (Filter Loại)
const categories = [
  { id: "all", name: "Tất cả", icon: <Filter size={16} /> },
  { id: "dat_vuon", name: "Đất Vườn/Ruộng", icon: <Wheat size={16} /> },
  { id: "nha_o", name: "Nhà Ở", icon: <Home size={16} /> },
  { id: "dat_nen", name: "Đất Nền", icon: <Trees size={16} /> },
  { id: "cho_thue", name: "Cho Thuê", icon: <Key size={16} /> },
];

// Danh mục Giá (Filter Giá)
const priceFilters = [
    { id: "all", name: "Mọi mức giá" },
    { id: "under_500", name: "< 500 Triệu" },
    { id: "500_1b", name: "500Tr - 1 Tỷ" },
    { id: "over_1b", name: "> 1 Tỷ" },
];

const RealEstatePage: React.FC<RealEstatePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceFilter, setActivePriceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);

  // Helper: Parse Price String to Number (Ước lượng để lọc)
  const parsePriceToNumber = (priceStr: string): number => {
      const str = priceStr.toLowerCase().replace(/,/g, '.');
      let value = 0;
      if (str.includes('tỷ')) {
          const num = parseFloat(str.replace(/[^0-9.]/g, ''));
          value = num * 1000000000;
      } else if (str.includes('tr') || str.includes('triệu')) {
          const num = parseFloat(str.replace(/[^0-9.]/g, ''));
          value = num * 1000000;
      }
      return value;
  };

  // 2. PARSE CSV DATA
  const parseCSV = (text: string): PropertyItem[] => {
    const rows = text.split('\n');
    
    // Regex để split CSV chuẩn, xử lý dấu phẩy trong ngoặc kép
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
    const idxDesc = getIndex(['mo_ta', 'description', 'noi_dung']);

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawVerified = getCol(idxVerified).toLowerCase();
            const isVerified = rawVerified.includes('verified') || rawVerified.includes('ok') || rawVerified.includes('xac thuc') || rawVerified.includes('duyet');
            const priceStr = getCol(idxPrice) || "Thỏa thuận";

            return {
                id: `bds-${index}`,
                title: getCol(idxTitle) || "Bất động sản Thạnh Lợi",
                price: priceStr,
                priceValue: parsePriceToNumber(priceStr),
                area: getCol(idxArea) || "-- m²",
                location: getCol(idxLocation) || "Thạnh Lợi",
                type: getCol(idxType) || "Khac",
                image: getCol(idxImage) || "https://placehold.co/800x600/1a1a1a/FFF?text=Nha+Dat",
                description: getCol(idxDesc) || "Liên hệ trực tiếp để biết thêm chi tiết về thửa đất/căn nhà này.",
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
    
    if (activeCategory === "dat_vuon") matchesCategory = typeLower.includes("vườn") || typeLower.includes("nông nghiệp") || typeLower.includes("lúa");
    else if (activeCategory === "nha_o") matchesCategory = typeLower.includes("nhà") || typeLower.includes("biệt thự");
    else if (activeCategory === "dat_nen") matchesCategory = typeLower.includes("nền") || typeLower.includes("thổ cư");
    else if (activeCategory === "cho_thue") matchesCategory = typeLower.includes("thuê");

    // Filter Price
    let matchesPrice = true;
    if (item.priceValue > 0) { // Chỉ lọc nếu parse được giá
        if (activePriceFilter === "under_500") matchesPrice = item.priceValue < 500000000;
        else if (activePriceFilter === "500_1b") matchesPrice = item.priceValue >= 500000000 && item.priceValue <= 1000000000;
        else if (activePriceFilter === "over_1b") matchesPrice = item.priceValue > 1000000000;
    }

    // Filter Search
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#0a0a0a] overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-100 font-sans">
      
      {/* 1. HEADER (Transparent Glass) */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-white flex items-center gap-2">
                BẤT ĐỘNG SẢN <span className="text-brand-cyan">THẠNH LỢI</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Sàn giao dịch chính chủ</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER (Sticky) */}
      <div className="sticky top-16 z-40 bg-[#0a0a0a]/95 border-b border-white/5 pb-4 pt-4 px-4 shadow-2xl">
         {/* Search Input */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm kiếm: Đất vườn, Nhà mặt tiền..." 
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-cyan transition-colors" size={18} />
         </div>

         {/* Filter Category Scroll */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>

         {/* Filter Price Scroll */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {priceFilters.map((p) => (
                <button
                    key={p.id}
                    onClick={() => setActivePriceFilter(p.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${
                        activePriceFilter === p.id
                        ? "bg-green-600/20 text-green-400 border-green-500/50"
                        : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600"
                    }`}
                >
                    {p.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. PROPERTY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tải dữ liệu nhà đất...</p>
            </div>
        )}

        {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <Home size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy bất động sản nào.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/10 hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300 flex flex-col h-full"
                >
                    {/* THUMBNAIL IMAGE (60% Height approx or aspect ratio) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900 cursor-pointer" onClick={() => setSelectedProperty(item)}>
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/800x600/1a1a1a/FFF?text=Nha+Dat"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent opacity-60"></div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 uppercase tracking-wide">
                            {item.type}
                        </div>
                        {item.isVerified && (
                            <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-green-500/50 flex items-center gap-1 shadow-lg shadow-green-900/50">
                                <CheckCircle2 size={12} fill="white" className="text-green-600" />
                                ĐÃ KIỂM DUYỆT
                            </div>
                        )}
                    </div>

                    {/* INFO BODY */}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 
                            className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2 min-h-[3rem] cursor-pointer hover:text-brand-cyan transition-colors"
                            onClick={() => setSelectedProperty(item)}
                        >
                            {item.title}
                        </h3>

                        {/* Price & Area Row */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-1">
                                <span className="text-[#FFD700] font-black text-xl drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                                    {item.price}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Ruler size={14} />
                                <span>{item.area}</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
                            <MapPin size={14} className="text-brand-cyan shrink-0" />
                            <span className="truncate">{item.location}</span>
                        </div>

                        {/* Action Footer */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button 
                                onClick={() => setSelectedProperty(item)}
                                className="bg-transparent border border-gray-600 text-gray-300 py-3 rounded-xl text-xs font-bold uppercase hover:border-brand-cyan hover:text-brand-cyan transition-all"
                            >
                                Xem chi tiết
                            </button>
                            <a 
                                href={`tel:${item.contact}`}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all"
                            >
                                <Phone size={14} fill="currentColor" /> Liên hệ
                            </a>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* 4. DETAIL MODAL */}
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
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-[#121212] w-full max-w-2xl rounded-2xl border border-gray-700 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => setSelectedProperty(null)}
                        className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-brand-cyan hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto custom-scrollbar flex-grow">
                        {/* Large Image */}
                        <div className="relative w-full aspect-video bg-black">
                            <img 
                                src={selectedProperty.image} 
                                alt={selectedProperty.title} 
                                className="w-full h-full object-cover"
                            />
                            {/* Flycam Promo Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-12">
                                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
                                    {selectedProperty.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-[#FFD700] font-bold text-lg">{selectedProperty.price}</span>
                                    <span className="text-gray-300 border-l border-gray-600 pl-4">{selectedProperty.area}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Body */}
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Highlights */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Loại hình</p>
                                    <p className="text-white font-semibold">{selectedProperty.type}</p>
                                </div>
                                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-xs uppercase font-bold mb-1">Xác thực</p>
                                    <p className={`font-bold ${selectedProperty.isVerified ? 'text-green-500' : 'text-gray-400'}`}>
                                        {selectedProperty.isVerified ? 'Đã kiểm duyệt' : 'Chưa xác thực'}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-brand-cyan font-bold uppercase text-sm mb-3">Thông tin chi tiết</h3>
                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-[#1a1a1a] p-5 rounded-xl border border-gray-800">
                                    {selectedProperty.description}
                                    <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2 text-xs text-gray-500 italic">
                                        <MapPin size={12} />
                                        Vị trí: {selectedProperty.location}
                                    </div>
                                </div>
                            </div>

                            {/* Flycam Promo Footer */}
                            <div className="flex items-center gap-3 bg-brand-cyan/5 border border-brand-cyan/20 p-3 rounded-lg">
                                <Camera size={18} className="text-brand-cyan" />
                                <p className="text-[10px] text-gray-400">
                                    Hình ảnh này được thực hiện bởi dịch vụ <span className="text-brand-cyan font-bold">Flycam Momo x HuyKyo</span>. Liên hệ quay chụp BĐS: 0386.328.473
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Actions */}
                    <div className="p-4 border-t border-gray-800 bg-[#121212] grid grid-cols-2 gap-4">
                         <a 
                            href={`tel:${selectedProperty.contact}`}
                            className="bg-green-600 hover:bg-green-500 text-white py-3.5 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
                        >
                            <Phone size={18} fill="currentColor" /> Gọi Chủ Đất
                        </a>
                        <a 
                            href={`https://zalo.me/${selectedProperty.contact}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
                        >
                            <MessageCircle size={18} /> Chat Zalo
                        </a>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING POST BUTTON */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan text-black rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center z-50 border-2 border-white"
      >
          <Plus size={28} />
      </motion.a>

    </div>
  );
};

export default RealEstatePage;

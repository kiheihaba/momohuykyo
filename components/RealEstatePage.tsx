
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Filter
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
  isVerified: boolean;  // xac_thuc == 'Verified'
  contact: string;      // sdt_lien_he
}

// 1. NGUỒN DỮ LIỆU
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=318672864&single=true&output=csv";

// Danh mục BĐS (Filter)
const categories = [
  { id: "all", name: "Tất cả", icon: <Filter size={16} /> },
  { id: "dat_vuon", name: "Đất Vườn", icon: <Wheat size={16} /> },
  { id: "nha_o", name: "Nhà Ở", icon: <Home size={16} /> },
  { id: "dat_nen", name: "Đất Nền", icon: <Trees size={16} /> },
  { id: "cho_thue", name: "Cho Thuê", icon: <Key size={16} /> },
];

const RealEstatePage: React.FC<RealEstatePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawVerified = getCol(idxVerified).toLowerCase();
            const isVerified = rawVerified.includes('verified') || rawVerified.includes('ok') || rawVerified.includes('xac thuc');

            return {
                id: `bds-${index}`,
                title: getCol(idxTitle) || "Bất động sản Thạnh Lợi",
                price: getCol(idxPrice) || "Thỏa thuận",
                area: getCol(idxArea) || "-- m²",
                location: getCol(idxLocation) || "Thạnh Lợi",
                type: getCol(idxType) || "Khac",
                image: getCol(idxImage) || "https://placehold.co/600x400?text=Nha+Dat",
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
    
    if (activeCategory === "dat_vuon") matchesCategory = typeLower.includes("vườn") || typeLower.includes("nông nghiệp");
    else if (activeCategory === "nha_o") matchesCategory = typeLower.includes("nhà");
    else if (activeCategory === "dat_nen") matchesCategory = typeLower.includes("nền") || typeLower.includes("thổ cư");
    else if (activeCategory === "cho_thue") matchesCategory = typeLower.includes("thuê");

    // Filter Search
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

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

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: Đất vườn, Nhà cấp 4,..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 4. PROPERTY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-blue-600" size={24} />
                <p>Đang tải dữ liệu nhà đất...</p>
            </div>
        )}

        {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <Home size={48} className="mx-auto mb-3 opacity-20" />
                <p>Chưa có tin đăng nào phù hợp.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProperties.map((item, index) => (
                <React.Fragment key={item.id}>
                    
                    {/* FLYCAM AD BANNER (Interspersed at index 2) */}
                    {index === 2 && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 relative overflow-hidden shadow-xl my-0 text-white flex items-center"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-[60px] rounded-full pointer-events-none"></div>
                            <div className="relative z-10 flex-1 pr-4">
                                <div className="inline-flex items-center gap-2 bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold px-2 py-1 rounded uppercase mb-2">
                                    <Camera size={12} /> Dịch vụ Premium
                                </div>
                                <h3 className="text-xl font-black uppercase leading-tight mb-2">
                                    Quay Flycam <br/> <span className="text-brand-cyan">Bất động sản</span>
                                </h3>
                                <p className="text-gray-400 text-xs mb-4">
                                    Giúp khách hàng hình dung toàn cảnh lô đất từ trên cao. Chốt sale nhanh gấp 3 lần.
                                </p>
                                <button className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-brand-cyan transition-colors shadow-lg shadow-white/10">
                                    Đặt lịch quay ngay
                                </button>
                            </div>
                            <div className="w-1/3 aspect-square rounded-lg overflow-hidden border border-gray-700 bg-black hidden sm:block">
                                <img 
                                    src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=400" 
                                    alt="Drone" 
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* PROPERTY CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                    >
                        {/* Thumbnail 4:3 */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Nha+Dat"; }}
                            />
                            
                            {/* Verified Badge */}
                            {item.isVerified && (
                                <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                                    <CheckCircle2 size={10} fill="currentColor" className="text-white" />
                                    ĐÃ XÁC THỰC
                                </div>
                            )}

                            {/* Type Label */}
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded">
                                {item.type}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow">
                            {/* Title: 2 lines */}
                            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2 h-[2.5em]" title={item.title}>
                                {item.title}
                            </h3>
                            
                            {/* Price */}
                            <p className="text-red-600 font-extrabold text-xl mb-3">
                                {item.price}
                            </p>

                            {/* Meta: Area & Location */}
                            <div className="flex items-center gap-3 text-gray-500 text-xs mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded shrink-0">
                                    <Ruler size={14} className="text-gray-400" /> 
                                    <span className="font-semibold text-gray-700">{item.area}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded truncate flex-1">
                                    <MapPin size={14} className="text-gray-400 shrink-0" /> 
                                    <span className="truncate">{item.location}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto grid grid-cols-2 gap-3">
                                 <a 
                                    href={`tel:${item.contact}`}
                                    className="bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-green-500 transition-colors shadow-md shadow-green-100"
                                 >
                                    <Phone size={14} /> Gọi Ngay
                                 </a>
                                 <a 
                                    href={`https://zalo.me/${item.contact}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-blue-500 transition-colors shadow-md shadow-blue-100"
                                 >
                                    <MessageCircle size={14} /> Chat Zalo
                                 </a>
                            </div>
                        </div>
                    </motion.div>

                </React.Fragment>
            ))}
        </div>
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
      
      <div className="fixed bottom-6 right-24 bg-black/80 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm pointer-events-none hidden md:block">
          Đăng bán đất miễn phí
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
      </div>

    </div>
  );
};

export default RealEstatePage;

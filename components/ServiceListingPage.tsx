
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  ExternalLink,
  Wrench,
  Truck,
  Scissors,
  Wheat,
  PartyPopper,
  Grid,
  UserPlus,
  RefreshCw,
  AlertCircle,
  User,
  Star,
  CheckCircle2
} from 'lucide-react';

interface ServiceListingPageProps {
  onBack: () => void;
}

interface ServiceItem {
  id: string;
  category: string; // loai_dich_vu
  name: string; // ten_tho
  description: string; // mo_ta_ngan
  location: string; // dia_chi / khu_vuc
  phone: string; // sdt
  image: string; // anh_dai_dien
  linkProfile: string; // link_ho_so
  isVerified: boolean; // xac_thuc
}

// URL Google Sheet CSV (Dịch vụ)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=987608880&single=true&output=csv";

// Danh mục dịch vụ (ID khớp với cột loai_dich_vu trong CSV)
const serviceCategories = [
  { id: "all", name: "TẤT CẢ", icon: <Grid size={16} /> },
  { id: "SuaChua", name: "SỬA CHỮA", icon: <Wrench size={16} /> },
  { id: "VanChuyen", name: "VẬN CHUYỂN", icon: <Truck size={16} /> },
  { id: "LamDep", name: "LÀM ĐẸP & Y TẾ", icon: <Scissors size={16} /> },
  { id: "NongNghiep", name: "NÔNG NGHIỆP", icon: <Wheat size={16} /> },
  { id: "TiecTung", name: "TIỆC TÙNG", icon: <PartyPopper size={16} /> },
];

const ServiceListingPage: React.FC<ServiceListingPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC DỮ LIỆU ---
  const normalizeHeader = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]/g, ""); 
  };

  const parseCSV = (text: string): ServiceItem[] => {
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
    const getIndex = (keys: string[]) => {
        return headers.findIndex(h => keys.includes(normalizeHeader(h)));
    };

    // Tìm cột dựa trên nhiều từ khóa (bao gồm loai_dich_vu)
    const idxImage = getIndex(['anhdaidien', 'anh', 'avatar', 'hinh', 'anh_dai_dien']);
    const idxName = getIndex(['tentho', 'hoten', 'ten', 'name', 'ten_tho']);
    const idxCategory = getIndex(['loaidichvu', 'loai_dich_vu', 'nghanhnghe', 'category']);
    const idxDesc = getIndex(['motangan', 'mota', 'description', 'skill', 'mo_ta_ngan']);
    const idxLocation = getIndex(['diachi', 'khuvuc', 'location', 'address', 'dia_chi']);
    const idxPhone = getIndex(['sdt', 'dienthoai', 'phone', 'contact']);
    const idxProfile = getIndex(['linkprofile', 'link_profile', 'profile', 'facebook', 'web', 'link_ho_so']); 
    const idxVerified = getIndex(['xac_thuc', 'verified', 'status']);

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (idx: number) => (idx !== -1 && cols[idx]) ? cols[idx].trim() : "";

            const verifiedStr = getCol(idxVerified).toLowerCase();
            const isVerified = verifiedStr.includes('verified') || verifiedStr.includes('ok') || verifiedStr.includes('xac thuc');

            return {
                id: `service-${index}`,
                category: getCol(idxCategory) || "Khac", 
                name: getCol(idxName) || "Thợ Thạnh Lợi",
                description: getCol(idxDesc) || "Liên hệ để biết thêm chi tiết",
                location: getCol(idxLocation) || "Thạnh Lợi",
                phone: getCol(idxPhone),
                image: getCol(idxImage),
                linkProfile: getCol(idxProfile),
                isVerified: isVerified
            };
        });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed to fetch CSV");
        const text = await response.text();
        const parsedData = parseCSV(text);
        setServices(parsedData);
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Đang cập nhật danh sách dịch vụ...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LOGIC LỌC (FILTERING) ---
  const filteredServices = services.filter(item => {
    // 1. Lọc theo Category
    const itemCat = item.category.trim().toLowerCase();
    const activeCat = activeCategory.toLowerCase();
    const matchesCategory = activeCategory === "all" || itemCat === activeCat;

    // 2. Lọc theo Tìm kiếm
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryDisplayName = (catCode: string) => {
      const found = serviceCategories.find(c => c.id.toLowerCase() === catCode.toLowerCase());
      return found ? found.name : catCode;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar text-white font-sans">
      
      {/* 1. HEADER (Dark & Glass) */}
      <div className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-gray-800 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white uppercase tracking-wide">
                Dịch Vụ & Thợ
            </h1>
            <p className="text-xs text-brand-cyan font-medium">Kết nối chuyên gia địa phương</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-[#121212]/95 pb-4 px-4 pt-4 shadow-xl sticky top-16 z-40 border-b border-gray-800">
         {/* Search */}
         <div className="relative mb-6">
             <input 
                type="text" 
                placeholder="Bạn đang tìm thợ gì? (VD: Sửa điện, Hớt tóc...)" 
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
         </div>

         {/* Filter Tabs */}
         <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {serviceCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeCategory === cat.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)] transform scale-105" 
                        : "bg-transparent text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                    }`}
                >
                    <span className="p-1 rounded-full bg-white/10">{cat.icon}</span>
                    {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. SERVICE LISTING (Grid Layout) */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 pb-32">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tải dữ liệu thợ...</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 bg-white/5 rounded-xl border border-red-900/50">
                <AlertCircle size={24} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredServices.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <User size={48} className="mx-auto mb-4 opacity-20" />
                <p>Chưa tìm thấy dịch vụ nào phù hợp.</p>
                <button 
                    onClick={() => setActiveCategory('all')} 
                    className="mt-4 text-brand-cyan text-sm font-bold uppercase hover:underline"
                >
                    Xem tất cả dịch vụ
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isLoading && !error && filteredServices.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col h-full bg-[#1a1a1a] border border-gray-800 hover:border-brand-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] rounded-2xl p-5 transition-all duration-300 relative group"
                >
                    
                    {/* PART 1: HEADER (Info) */}
                    <div className="flex items-center gap-4 mb-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-brand-cyan to-blue-600">
                                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/100x100/333/FFF?text=" + item.name.charAt(0);
                                        }}
                                    />
                                </div>
                            </div>
                            {item.isVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" title="Đã xác thực">
                                    <CheckCircle2 size={14} className="text-blue-600 fill-blue-100" />
                                </div>
                            )}
                        </div>

                        {/* Name & Badge */}
                        <div className="min-w-0">
                            <h3 className="text-brand-cyan font-bold text-lg truncate leading-tight">
                                {item.name}
                            </h3>
                            <span className="inline-block mt-1 bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-purple-500/30">
                                {getCategoryDisplayName(item.category)}
                            </span>
                        </div>
                    </div>

                    {/* PART 2: BODY (Description) */}
                    <div className="flex-grow mb-4">
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3 h-[2.5em] leading-relaxed">
                            {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={14} className="text-red-500 shrink-0" />
                            <span className="truncate">{item.location}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 mb-4"></div>

                    {/* PART 3: ACTION FOOTER */}
                    <div className={`grid gap-3 ${item.linkProfile ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {/* Call Button (Always Show) */}
                        <a 
                            href={`tel:${item.phone}`}
                            className="bg-[#00C853] hover:bg-[#00E676] text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-[0_4px_10px_rgba(0,200,83,0.3)] active:scale-95"
                        >
                            <Phone size={16} fill="currentColor" /> Gọi Ngay
                        </a>

                        {/* View Profile Button (Conditional) */}
                        {item.linkProfile && (
                            <a 
                                href={item.linkProfile}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-transparent border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                Xem Hồ Sơ <ExternalLink size={16} />
                            </a>
                        )}
                    </div>

                </motion.div>
            ))}
        </div>
      </div>

      {/* 4. FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t border-gray-800 p-4 pb-6 z-50">
         <a 
            href="https://zalo.me/0386328473" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white text-black py-3.5 rounded-xl font-black uppercase tracking-wider hover:bg-brand-cyan transition-colors shadow-lg"
         >
             <UserPlus size={20} /> Đăng ký làm thợ
         </a>
      </div>

    </div>
  );
};

export default ServiceListingPage;

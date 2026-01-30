
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Wrench,
  Truck,
  Scissors,
  Wheat,
  PartyPopper,
  Grid,
  UserPlus,
  Camera,
  RefreshCw,
  AlertCircle,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ServiceListingPageProps {
  onBack: () => void;
}

interface ServiceItem {
  id: string;
  category: string; // loai_dich_vu
  name: string; // ten_tho
  description: string; // mo_ta_ngan
  location: string; // dia_chi
  phone: string; // sdt
  image: string; // anh_dai_dien
  linkProfile: string; // link_profile (NEW)
}

// URL Google Sheet CSV (Dịch vụ)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=987608880&single=true&output=csv";

// Danh mục dịch vụ
const serviceCategories = [
  { id: "all", name: "Tất cả", icon: <Grid size={18} /> },
  { id: "Sửa chữa", name: "Sửa chữa", icon: <Wrench size={18} /> },
  { id: "Vận chuyển", name: "Vận chuyển", icon: <Truck size={18} /> },
  { id: "Làm đẹp", name: "Làm đẹp", icon: <Scissors size={18} /> },
  { id: "Nông nghiệp", name: "Nông nghiệp", icon: <Wheat size={18} /> },
  { id: "Tiệc tùng", name: "Tiệc tùng", icon: <PartyPopper size={18} /> },
];

const ServiceListingPage: React.FC<ServiceListingPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC DỮ LIỆU (GIỮ NGUYÊN) ---
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

    const idxImage = getIndex(['anhdaidien', 'anh', 'avatar', 'hinh']);
    const idxName = getIndex(['tentho', 'hoten', 'ten', 'name']);
    const idxCategory = getIndex(['loaidichvu', 'nghanhnghe', 'loai', 'category']);
    const idxDesc = getIndex(['motangan', 'mota', 'description', 'skill']);
    const idxLocation = getIndex(['diachi', 'khuvuc', 'location', 'address']);
    const idxPhone = getIndex(['sdt', 'dienthoai', 'phone', 'contact']);
    const idxProfile = getIndex(['linkprofile', 'link_profile', 'profile', 'facebook', 'web', 'trangcanhan']); 

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (idx: number) => (idx !== -1 && cols[idx]) ? cols[idx].trim() : "";

            return {
                id: `service-${index}`,
                category: getCol(idxCategory) || "Dịch vụ khác",
                name: getCol(idxName) || "Thợ Thạnh Lợi",
                description: getCol(idxDesc) || "Liên hệ để biết thêm chi tiết",
                location: getCol(idxLocation) || "Thạnh Lợi",
                phone: getCol(idxPhone),
                image: getCol(idxImage),
                linkProfile: getCol(idxProfile)
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

  const filteredServices = services.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory || (activeCategory !== "all" && item.category.includes(activeCategory));
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar text-white font-sans">
      
      {/* 1. HEADER (Dark & Glass) */}
      <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-gray-800 px-4 h-16 flex items-center gap-4 shadow-lg">
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

      {/* 2. SEARCH & FILTER (Premium Dark UI) */}
      <div className="bg-[#050505]/95 pb-4 px-4 pt-4 shadow-xl sticky top-16 z-40 border-b border-gray-800">
         {/* Search */}
         <div className="relative mb-6">
             <input 
                type="text" 
                placeholder="Tìm thợ điện, xe ba gác..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
         </div>

         {/* Filter Tabs (Horizontal Scroll) */}
         <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {serviceCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeCategory === cat.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)]" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-gray-500 hover:text-white"
                    }`}
                >
                    {cat.icon}
                    {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. SERVICE LISTING (Glassmorphism Cards) */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-32">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tìm kiếm thợ...</p>
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
            </div>
        )}

        {!isLoading && !error && filteredServices.map((item, index) => (
            <React.Fragment key={item.id}>
                
                {/* SPONSORED BANNER (Giữ nguyên nhưng style Dark Mode) */}
                {index === 2 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-5 border border-gray-800 relative overflow-hidden shadow-2xl my-8"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-cyan/10 blur-[50px] rounded-full"></div>
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div>
                                <span className="bg-brand-cyan text-black text-[10px] font-black px-2 py-0.5 uppercase mb-2 inline-block">Tài trợ</span>
                                <h3 className="text-white font-black uppercase text-xl leading-tight mb-1">Rạp Cưới <br/> <span className="text-brand-cyan">Momo x HuyKyo</span></h3>
                                <p className="text-gray-400 text-xs">Trang trí tiệc & Quay phim chuyên nghiệp</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                    <button className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1 hover:bg-brand-cyan transition-colors">
                                    <Camera size={14} /> Xem mẫu
                                    </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SERVICE CARD (Premium Glassmorphism) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="group bg-[#1e1e1e]/80 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300 relative overflow-hidden"
                >
                    <div className="flex flex-row items-start gap-4">
                        
                        {/* Left: Avatar with Neon Glow */}
                        <div className="flex-shrink-0 relative">
                             <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-br from-brand-cyan to-purple-600 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                                    {item.image && item.image.length > 5 ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { 
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500 font-bold text-2xl uppercase ${item.image && item.image.length > 5 ? 'hidden' : ''}`}>
                                        {item.name ? item.name.charAt(0) : <User size={30} />}
                                    </div>
                                </div>
                             </div>
                             {/* Online Dot */}
                             <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></div>
                        </div>

                        {/* Right: Info */}
                        <div className="flex-1 min-w-0">
                             {/* Name */}
                             <h3 className="font-bold text-white text-lg leading-tight truncate mb-1.5 group-hover:text-brand-cyan transition-colors">
                                {item.name}
                             </h3>
                             
                             {/* Badge Category */}
                             <span className="inline-block bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border border-white/10 text-brand-cyan text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide mb-2">
                                {item.category}
                             </span>

                             {/* Description */}
                             <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                                {item.description}
                             </p>

                             {/* Location */}
                             <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin size={12} className="text-red-500" /> 
                                <span className="truncate">{item.location}</span>
                             </div>
                        </div>
                    </div>

                    {/* Action Buttons (Horizontal Layout) */}
                    <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/10">
                        <a 
                            href={`tel:${item.phone}`}
                            className="group/btn flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all active:scale-95"
                        >
                            <Phone size={16} className="group-hover/btn:animate-pulse" /> 
                            Gọi Ngay
                        </a>

                        {item.linkProfile ? (
                            <a 
                                href={item.linkProfile}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-transparent border border-brand-cyan text-brand-cyan py-3 rounded-xl text-xs font-bold uppercase hover:bg-brand-cyan hover:text-black transition-all active:scale-95"
                            >
                                Xem Hồ Sơ <ExternalLink size={16} />
                            </a>
                        ) : (
                            <a 
                                href={`https://zalo.me/${item.phone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-transparent border border-blue-500 text-blue-400 py-3 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                            >
                                Chat Zalo <MessageCircle size={16} />
                            </a>
                        )}
                    </div>

                </motion.div>

            </React.Fragment>
        ))}
      </div>

      {/* 4. FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-md border-t border-gray-800 p-4 pb-6 z-50">
         <a 
            href="https://zalo.me/0386328473" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white text-black py-3.5 rounded-xl font-black uppercase tracking-wider hover:bg-brand-cyan transition-colors shadow-lg"
         >
             <UserPlus size={20} /> Đăng ký làm thợ / Đối tác
         </a>
      </div>

    </div>
  );
};

export default ServiceListingPage;

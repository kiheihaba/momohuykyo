
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
  Star,
  UserPlus,
  Camera,
  RefreshCw,
  AlertCircle
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
}

// URL Google Sheet CSV
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=987608880&single=true&output=csv";

// Danh mục dịch vụ với Icon tương ứng
const serviceCategories = [
  { id: "all", name: "Tất cả", icon: <Grid size={20} />, color: "bg-gray-100 text-gray-600" },
  { id: "Sửa chữa", name: "Sửa chữa", icon: <Wrench size={20} />, color: "bg-blue-100 text-blue-600" },
  { id: "Vận chuyển", name: "Vận chuyển", icon: <Truck size={20} />, color: "bg-orange-100 text-orange-600" },
  { id: "Làm đẹp & Y tế", name: "Làm đẹp", icon: <Scissors size={20} />, color: "bg-pink-100 text-pink-600" },
  { id: "Nông nghiệp", name: "Nông nghiệp", icon: <Wheat size={20} />, color: "bg-green-100 text-green-600" },
  { id: "Tiệc tùng", name: "Tiệc tùng", icon: <PartyPopper size={20} />, color: "bg-purple-100 text-purple-600" },
];

const ServiceListingPage: React.FC<ServiceListingPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed to fetch CSV");
        const text = await response.text();
        const rows = text.split('\n');

        if (rows.length > 1) {
             // Helper: Parse CSV Line safely
            const parseLine = (line: string): string[] => {
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return parts.map(part => {
                    let p = part.trim();
                    if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
                    return p.replace(/""/g, '"');
                });
            };

            // Detect Headers
            const headers = parseLine(rows[0]);
            const getIndex = (key: string) => headers.findIndex(h => h.toLowerCase().trim() === key.toLowerCase().trim());

            // Map columns dynamically based on Sheet headers
            const idxCategory = getIndex('loai_dich_vu');
            const idxName = getIndex('ten_tho');
            const idxDesc = getIndex('mo_ta_ngan');
            const idxLocation = getIndex('dia_chi');
            const idxPhone = getIndex('sdt');
            const idxImage = getIndex('anh_dai_dien');

            const parsedData = rows.slice(1)
                .filter(r => r.trim() !== '')
                .map((row, index) => {
                    const cols = parseLine(row);
                    const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i] : "";

                    return {
                        id: `service-${index}`,
                        category: getCol(idxCategory) || "Khác",
                        name: getCol(idxName) || "Thợ Thạnh Lợi",
                        description: getCol(idxDesc) || "Liên hệ để biết thêm chi tiết",
                        location: getCol(idxLocation) || "Thạnh Lợi",
                        phone: getCol(idxPhone),
                        image: getCol(idxImage) || "https://placehold.co/200x200/eee/999?text=Dịch+Vụ",
                    };
                });
            setServices(parsedData);
        }
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Không thể tải dữ liệu dịch vụ.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredServices = services.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900">Tiện ích Thạnh Lợi</h1>
            <p className="text-xs text-gray-500">Tìm thợ, xe ôm, làm đẹp quanh đây</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm thợ điện, xe ba gác..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Horizontal Category Scroll */}
         <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {serviceCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[70px] flex-shrink-0 transition-all ${
                        activeCategory === cat.id ? 'opacity-100 scale-105' : 'opacity-70 grayscale'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cat.color} ${activeCategory === cat.id ? 'shadow-md ring-2 ring-offset-1 ring-blue-500' : ''}`}>
                        {cat.icon}
                    </div>
                    <span className={`text-[10px] font-bold text-center ${activeCategory === cat.id ? 'text-blue-600' : 'text-gray-500'}`}>
                        {cat.name}
                    </span>
                </button>
            ))}
         </div>
      </div>

      {/* 3. SERVICE LISTING */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-blue-600" size={24} />
                <p>Đang tải danh sách thợ...</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 text-red-500">
                <AlertCircle size={24} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredServices.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>Chưa tìm thấy dịch vụ nào phù hợp.</p>
            </div>
        )}

        {!isLoading && !error && filteredServices.map((item, index) => (
            <React.Fragment key={item.id}>
                
                {/* SPONSORED BANNER (Position 3 -> Index 2) */}
                {index === 2 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#121212] rounded-xl p-4 border border-gray-800 relative overflow-hidden shadow-lg my-6"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[40px] rounded-full"></div>
                        <div className="relative z-10 flex items-center justify-between gap-4">
                            <div>
                                <span className="bg-brand-cyan text-black text-[10px] font-black px-2 py-0.5 uppercase mb-1 inline-block">Tài trợ</span>
                                <h3 className="text-white font-black uppercase text-lg leading-tight">Rạp Cưới <br/> <span className="text-brand-cyan">Momo x HuyKyo</span></h3>
                                <p className="text-gray-400 text-xs mt-1">Trang trí tiệc & Quay phim chuyên nghiệp</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                    <button className="bg-white text-black text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-brand-cyan transition-colors">
                                    <Camera size={14} /> Xem mẫu
                                    </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* SERVICE CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 items-start"
                >
                    {/* Left: Avatar */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200/eee/999?text=IMG" }}
                        />
                    </div>

                    {/* Middle: Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full min-h-[80px]">
                        <div>
                            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{item.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mb-1 mt-0.5">
                                <Star size={10} fill="currentColor" /> Uy tín - Thạnh Lợi
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                            <MapPin size={12} /> {item.location}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 justify-center h-full min-h-[80px]">
                        <a 
                            href={`tel:${item.phone}`}
                            className="w-24 bg-green-600 text-white py-2 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-green-500 shadow-md shadow-green-200 active:scale-95 transition-all"
                        >
                            <Phone size={14} /> Gọi ngay
                        </a>
                        <a 
                            href={`https://zalo.me/${item.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-24 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-blue-500 shadow-md shadow-blue-200 active:scale-95 transition-all"
                        >
                            <MessageCircle size={14} /> Chat Zalo
                        </a>
                    </div>
                </motion.div>

            </React.Fragment>
        ))}
      </div>

      {/* 4. FOOTER CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 z-50">
         <a 
            href="https://zalo.me/0386328473" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl font-bold uppercase hover:bg-black transition-colors shadow-lg"
         >
             <UserPlus size={20} /> Đăng ký làm thợ / Đối tác
         </a>
      </div>

    </div>
  );
};

export default ServiceListingPage;

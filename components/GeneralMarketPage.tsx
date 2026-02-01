
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Filter,
  Phone,
  MessageCircle,
  Package,
  RefreshCw,
  MapPin,
  User,
  Tag,
  Percent,
  Sparkles,
  Zap,
  Home,
  Smartphone
} from 'lucide-react';

interface GeneralMarketPageProps {
  onBack: () => void;
}

interface MarketItem {
  id: string;
  name: string;         // ten_san_pham
  price: string;        // gia_tien
  image: string;        // anh_san_pham
  seller: string;       // nguoi_ban
  phone: string;        // sdt_lien_he
  category: string;     // loai_hang (Mapped to: GiaDung, ThoiTrang, CongNghe...)
  status: 'ConHang' | 'DaBan'; // tinh_trang
  isNew: boolean;       // trang_thai == 'Moi'
  discount: string;     // giam_gia (VD: -20%)
  location: string;     // dia_chi (Mac dinh: Thanh Loi)
}

// 1. NGUỒN DỮ LIỆU
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=964173450&single=true&output=csv";

// 2. DANH MỤC LỌC (Cập nhật ID theo yêu cầu Logic)
const categories = [
  { id: "all", name: "Tất cả", icon: <Package size={16} /> },
  { id: "GiaDung", name: "Gia Dụng", icon: <Home size={16} /> },
  { id: "ThoiTrang", name: "Thời trang", icon: <Tag size={16} /> },
  { id: "CongNghe", name: "Công Nghệ", icon: <Smartphone size={16} /> },
  { id: "DoCu", name: "Đồ cũ / Thanh lý", icon: <RefreshCw size={16} /> },
  { id: "Khac", name: "Khác", icon: <Zap size={16} /> },
];

const GeneralMarketPage: React.FC<GeneralMarketPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Chuẩn hóa danh mục từ CSV đầu vào sang Mã chuẩn
  const normalizeCategory = (input: string): string => {
      if (!input) return "Khac";
      const s = input.toLowerCase().replace(/\s/g, ''); // Xóa khoảng trắng, chữ thường
      // Remove accents
      const norm = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      if (norm.includes('giadung')) return 'GiaDung';
      if (norm.includes('thoitrang')) return 'ThoiTrang';
      if (norm.includes('congnghe')) return 'CongNghe';
      if (norm.includes('docu') || norm.includes('thanhly') || norm.includes('cu')) return 'DoCu';
      
      // Nếu không khớp các key trên, trả về Khac (hoặc giữ nguyên nếu muốn mở rộng)
      return 'Khac';
  };

  // 3. PARSE CSV DATA
  const parseCSV = (text: string): MarketItem[] => {
    const rows = text.split('\n');
    
    // Helper split CSV logic
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
    const idxName = getIndex(['ten_san_pham', 'ten', 'name']);
    const idxPrice = getIndex(['gia_tien', 'gia', 'price']);
    const idxImage = getIndex(['anh_san_pham', 'anh', 'image']);
    const idxSeller = getIndex(['nguoi_ban', 'seller', 'shop']);
    const idxPhone = getIndex(['sdt_lien_he', 'sdt', 'phone']);
    const idxCategory = getIndex(['loai_hang', 'phan_loai', 'loai', 'category']); // Ưu tiên 'loai_hang'
    const idxStatus = getIndex(['tinh_trang', 'status']); // Con Hang / Da Ban
    const idxNew = getIndex(['trang_thai', 'condition']); // Moi / Cu
    const idxDiscount = getIndex(['giam_gia', 'discount', 'sale']);
    const idxLocation = getIndex(['dia_chi', 'location']);

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawStatus = getCol(idxStatus).toLowerCase();
            const status: 'ConHang' | 'DaBan' = (rawStatus.includes('daban') || rawStatus.includes('sold') || rawStatus.includes('đã bán')) ? 'DaBan' : 'ConHang';
            
            const rawNew = getCol(idxNew).toLowerCase();
            const isNew = rawNew.includes('moi') || rawNew.includes('new') || rawNew.includes('mới');

            // Xử lý Category chuẩn hóa
            const rawCat = getCol(idxCategory);
            const normalizedCat = normalizeCategory(rawCat);

            return {
                id: `market-${index}`,
                name: getCol(idxName) || "Sản phẩm chưa đặt tên",
                price: getCol(idxPrice) || "Liên hệ",
                image: getCol(idxImage) || "https://placehold.co/400x400/1a1a1a/00FFFF?text=Cho+Thanh+Loi",
                seller: getCol(idxSeller) || "Người bán Thạnh Lợi",
                phone: getCol(idxPhone),
                category: normalizedCat, 
                status: status,
                isNew: isNew,
                discount: getCol(idxDiscount),
                location: getCol(idxLocation) || "Thạnh Lợi"
            };
        });
    
    // Sort: Còn hàng lên trước, sau đó ưu tiên Mới
    return parsed.sort((a, b) => {
        if (a.status === 'DaBan' && b.status !== 'DaBan') return 1;
        if (a.status !== 'DaBan' && b.status === 'DaBan') return -1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
        const text = await response.text();
        const data = parseCSV(text);
        setItems(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Đang cập nhật chợ...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 4. LOGIC FILTER CHÍNH XÁC (STRICT MATCHING)
  const filteredItems = items.filter(item => {
    // Logic 1: Lọc theo Category ID
    let matchesCategory = true;
    if (activeCategory !== "all") {
        matchesCategory = item.category === activeCategory;
    }

    // Logic 2: Lọc theo Search Term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-100">
      
      {/* 1. HEADER (Transparent Glass) */}
      <div className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10 px-4 h-16 flex items-center justify-between shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center md:text-left md:ml-4">
            <h1 className="font-black text-lg leading-none text-white uppercase tracking-wider">
                CHỢ <span className="text-brand-cyan">MUA SẮM</span>
            </h1>
        </div>
        <div className="bg-brand-cyan/20 p-2 rounded-full text-brand-cyan border border-brand-cyan/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
            <ShoppingBag size={20} />
        </div>
      </div>

      {/* 2. HERO SEARCH SECTION */}
      <section className="relative py-8 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#121212] border-b border-white/5">
         {/* Background Glow Effect */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-full bg-brand-cyan/5 blur-[80px] rounded-full pointer-events-none"></div>

         <div className="relative w-full max-w-2xl z-10">
             <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm: Điện thoại, Đồ gia dụng,..." 
                    className="w-full bg-[#1E1E1E] border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all shadow-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-cyan transition-colors" size={20} />
             </div>
         </div>
      </section>

      {/* 3. STICKY FILTER BAR */}
      <div className="sticky top-16 z-40 bg-[#121212]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-md">
         <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-105" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 4. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tải dữ liệu chợ...</p>
            </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <Package size={64} className="mb-4 opacity-20 text-brand-cyan" />
                <p className="text-lg font-bold text-gray-300">Chưa có sản phẩm nào trong mục này</p>
                <p className="text-sm mt-1">Mời bà con đăng tin!</p>
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="mt-6 text-brand-cyan font-bold uppercase text-xs hover:underline"
                >
                  Xem tất cả sản phẩm
                </button>
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map((item, index) => {
                const isSold = item.status === 'DaBan';

                return (
                    <motion.div
                        key={item.id}
                        layout // Framer Motion layout prop for smooth reordering
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.05 }}
                        className={`group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 flex flex-col h-full relative hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all duration-300 ${isSold ? 'opacity-60 grayscale' : ''}`}
                    >
                        {/* IMAGE SECTION (Square) */}
                        <div className="aspect-square relative overflow-hidden bg-black/50">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/1a1a1a/333?text=No+Image"; }}
                            />
                            
                            {/* OVERLAYS */}
                            {isSold && (
                                <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center pointer-events-none">
                                    <span className="border-4 border-white text-white font-black text-xl px-4 py-2 uppercase -rotate-12 tracking-widest whitespace-nowrap">ĐÃ BÁN</span>
                                </div>
                            )}

                            {/* BADGES */}
                            {!isSold && (
                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    {item.isNew && (
                                        <span className="bg-brand-cyan text-black text-[10px] font-black px-2 py-1 rounded shadow-[0_0_10px_rgba(0,255,255,0.5)] uppercase tracking-wide animate-pulse">
                                            MỚI
                                        </span>
                                    )}
                                    {item.discount && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-0.5">
                                            <Percent size={10} /> {item.discount}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="p-4 flex flex-col flex-grow">
                            {/* Title */}
                            <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 min-h-[2.5em] mb-2 leading-snug group-hover:text-brand-cyan transition-colors" title={item.name}>
                                {item.name}
                            </h3>

                            {/* Price */}
                            <div className="mb-3">
                                <span className={`text-lg md:text-xl font-black ${isSold ? 'text-gray-500 line-through' : 'text-brand-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.3)]'}`}>
                                    {item.price}
                                </span>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-col gap-1 mt-auto pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <User size={12} className="text-gray-500 shrink-0" />
                                    <span className="truncate">{item.seller}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <MapPin size={12} className="text-gray-500 shrink-0" />
                                    <span className="truncate">{item.location}</span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS (Parallel) */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                                        isSold 
                                        ? "bg-white/10 text-gray-500 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95"
                                    }`}
                                >
                                    <Phone size={16} fill="currentColor" /> Gọi
                                </a>
                                <a 
                                    href={isSold ? undefined : `https://zalo.me/${item.phone}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                                        isSold 
                                        ? "bg-white/10 text-gray-500 cursor-not-allowed" 
                                        : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-95"
                                    }`}
                                >
                                    <MessageCircle size={16} /> Zalo
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

export default GeneralMarketPage;

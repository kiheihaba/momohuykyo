
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Share2, 
  HeartHandshake, 
  Siren, 
  Gift, 
  Megaphone, 
  CheckCircle2, 
  Clock,
  Plus,
  RefreshCw,
  AlertTriangle,
  X,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface CommunityPageProps {
  onBack: () => void;
}

interface CommunityItem {
  id: string;
  title: string;       // tieu_de
  description: string; // mo_ta
  image: string;       // hinh_anh
  type: 'sos' | 'free' | 'news'; // loai_tin (tim_do, tang_do, tin_tuc)
  status: 'active' | 'resolved'; // trang_thai (dang_tim, da_tim_thay/da_tang)
  location: string;    // khu_vuc
  phone: string;       // sdt_lien_he
  time: string;        // thoi_gian (VD: 1 giờ trước)
}

// URL Google Sheet Mới
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=2048156150&single=true&output=csv";

const filters = [
  { id: 'all', label: 'Tất cả tin', icon: <HeartHandshake size={16} />, color: 'bg-gray-800 text-white border-gray-600' },
  { id: 'sos', label: 'TÌM ĐỒ / SOS', icon: <Siren size={16} />, color: 'bg-red-900/40 text-red-400 border-red-500/50' },
  { id: 'free', label: 'CHO TẶNG', icon: <Gift size={16} />, color: 'bg-green-900/40 text-green-400 border-green-500/50' },
  { id: 'news', label: 'TIN TỨC XÃ', icon: <Megaphone size={16} />, color: 'bg-blue-900/40 text-blue-400 border-blue-500/50' },
  { id: 'resolved', label: 'ĐÃ XONG', icon: <CheckCircle2 size={16} />, color: 'bg-gray-800 text-gray-500 border-gray-700' },
];

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CommunityItem | null>(null);

  // --- PARSE CSV ---
  const parseCSV = (text: string): CommunityItem[] => {
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

    const idxTitle = getIndex(['tieu_de', 'title']);
    const idxDesc = getIndex(['mo_ta', 'noi_dung', 'content']);
    const idxImage = getIndex(['hinh_anh', 'image']);
    const idxType = getIndex(['loai_tin', 'type']);
    const idxStatus = getIndex(['trang_thai', 'status']);
    const idxLoc = getIndex(['khu_vuc', 'dia_chi', 'location']);
    const idxPhone = getIndex(['sdt', 'phone', 'sdt_lien_he']);
    const idxTime = getIndex(['thoi_gian', 'time', 'ngay_dang']);

    return rows.slice(1).filter(r => r.trim() !== '').map((row, index) => {
        const cols = parseLine(row);
        const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

        // Normalize Type
        const rawType = getCol(idxType).toLowerCase();
        let type: 'sos' | 'free' | 'news' = 'news';
        if (rawType.includes('tim') || rawType.includes('lac') || rawType.includes('sos')) type = 'sos';
        else if (rawType.includes('tang') || rawType.includes('free') || rawType.includes('cho')) type = 'free';

        // Normalize Status
        const rawStatus = getCol(idxStatus).toLowerCase();
        const status = (rawStatus.includes('xong') || rawStatus.includes('thay') || rawStatus.includes('het') || rawStatus.includes('done')) ? 'resolved' : 'active';

        return {
            id: `comm-${index}`,
            title: getCol(idxTitle) || "Thông báo cộng đồng",
            description: getCol(idxDesc),
            image: getCol(idxImage) || "https://placehold.co/600x400/121212/333?text=Community",
            type,
            status,
            location: getCol(idxLoc) || "Thạnh Lợi",
            phone: getCol(idxPhone),
            time: getCol(idxTime) || "Vừa xong"
        };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const data = parseCSV(text);
        setItems(data.reverse()); // Tin mới nhất lên đầu
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const filteredItems = items.filter(item => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'resolved') return item.status === 'resolved';
      if (item.status === 'resolved') return false; 
      return item.type === activeFilter;
  });

  const handleShare = (item: CommunityItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `${item.type === 'sos' ? '🆘' : '📢'} ${item.title}\n📍 ${item.location}\n📞 LH: ${item.phone}`;
    if (navigator.share) {
        navigator.share({ title: item.title, text: text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép nội dung tin!');
    }
  };

  const handleZaloShare = () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://zalo.me/share/?url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-200">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white flex items-center gap-2 uppercase tracking-wide">
                GÓC CỘNG ĐỒNG <span className="text-red-500 text-xs">Beta</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Thạnh Lợi Connect</p>
        </div>
        <div className="bg-gray-800 p-2 rounded-full text-brand-cyan border border-gray-700">
            <HeartHandshake size={20} />
        </div>
      </div>

      {/* 2. SMART FILTERS */}
      <div className="sticky top-16 z-40 bg-[#121212] pb-4 pt-4 px-4 border-b border-gray-800 shadow-xl">
         <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {filters.map((f) => (
                <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wider ${
                        activeFilter === f.id 
                        ? `${f.color} shadow-lg scale-105` 
                        : "bg-[#1E1E1E] text-gray-500 border-gray-800 hover:border-gray-600"
                    }`}
                >
                   {f.icon} {f.label}
                </button>
            ))}
         </div>
      </div>

      {/* 3. GRID CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang cập nhật tin tức...</p>
            </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <HeartHandshake size={48} className="mx-auto mb-4 opacity-20" />
                <p>Chưa có tin nào trong mục này.</p>
                <p className="text-xs mt-2">Hãy là người đầu tiên chia sẻ!</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
                const isResolved = item.status === 'resolved';
                
                // Color Logic
                let badgeColor = "bg-blue-600";
                let badgeText = "TIN TỨC";
                if (item.type === 'sos') { badgeColor = "bg-red-600 animate-pulse"; badgeText = "SOS - ĐANG TÌM"; }
                if (item.type === 'free') { badgeColor = "bg-green-600"; badgeText = "FREE - TẶNG"; }
                if (isResolved) { badgeColor = "bg-gray-600"; badgeText = item.type === 'sos' ? "ĐÃ TÌM THẤY" : "ĐÃ TẶNG"; }

                // Phone Sanitization Logic
                const sanitizedPhone = item.phone ? item.phone.replace(/\D/g, '') : '';

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedItem(item)} // Open Modal Handler
                        className={`relative bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden flex flex-col cursor-pointer ${isResolved ? 'opacity-60 grayscale' : 'hover:border-gray-600 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]'} transition-all duration-300`}
                    >
                        {/* IMAGE HEADER (4:3) */}
                        <div className="aspect-[4/3] relative bg-black overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1a1a1a/333?text=No+Image"; }}
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`${badgeColor} text-white text-[10px] font-black px-3 py-1 rounded shadow-md uppercase tracking-wide`}>
                                    {badgeText}
                                </span>
                            </div>
                            
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                <Clock size={10} /> {item.time}
                            </div>

                            {/* RESOLVED STAMP OVERLAY */}
                            {isResolved && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                                    <div className="border-4 border-white text-white text-xl font-black uppercase px-6 py-2 -rotate-12 tracking-widest opacity-80">
                                        {item.type === 'sos' ? 'ĐÃ TÌM THẤY' : 'ĐÃ TẶNG XONG'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CONTENT BODY */}
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className={`text-lg font-bold text-white mb-2 line-clamp-2 ${item.type === 'sos' && !isResolved ? 'text-red-400' : ''}`}>
                                {item.title}
                            </h3>
                            
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-[#252525] p-2 rounded-lg">
                                <MapPin size={14} className="text-brand-cyan shrink-0" />
                                <span className="truncate text-gray-300 font-medium">{item.location}</span>
                            </div>

                            {/* ACTIONS FOOTER */}
                            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800">
                                {item.phone && sanitizedPhone ? (
                                    <a
                                        href={`tel:${sanitizedPhone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`col-span-3 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                                            isResolved 
                                            ? "bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none" 
                                            : "bg-white text-black hover:bg-gray-200"
                                        }`}
                                    >
                                        <Phone size={14} fill="currentColor" /> Liên hệ ngay
                                    </a>
                                ) : (
                                    <span className="col-span-3 py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 bg-gray-800 text-gray-500 cursor-not-allowed">
                                        Chưa có SĐT
                                    </span>
                                )}
                                
                                <button 
                                    onClick={(e) => handleShare(item, e)}
                                    className="col-span-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

      {/* 4. FAB - ĐĂNG TIN */}
      <motion.a
         href="https://zalo.me/0386328473" // Thay bằng Zalo Admin HuyKyo
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center z-50 border-4 border-[#121212] group"
      >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          
          {/* Tooltip Hint */}
          <div className="absolute right-full mr-4 bg-white text-black text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg hidden group-hover:block">
              Đăng tin SOS / Tặng đồ
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
          </div>
      </motion.a>

      {/* 5. DETAIL MODAL (POPUP / BOTTOM SHEET) */}
      <AnimatePresence>
        {selectedItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
                onClick={() => setSelectedItem(null)}
            >
                <motion.div
                    initial={{ y: "100%", opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: "100%", opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#1a1a1a] w-full md:max-w-lg rounded-t-2xl md:rounded-2xl border border-gray-800 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Image */}
                    <div className="relative aspect-video bg-black shrink-0">
                        <img 
                            src={selectedItem.image} 
                            alt={selectedItem.title} 
                            className={`w-full h-full object-cover ${selectedItem.status === 'resolved' ? 'grayscale opacity-50 blur-[2px]' : ''}`}
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400/121212/333?text=Community"; }}
                        />
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 z-30 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Resolved Stamp - Centered */}
                        {selectedItem.status === 'resolved' && (
                             <div className="absolute inset-0 flex items-center justify-center z-20">
                                 <div className="border-4 border-white text-white text-2xl font-black uppercase px-6 py-2 -rotate-12 tracking-widest opacity-90 shadow-lg">
                                     {selectedItem.type === 'sos' ? 'ĐÃ TÌM THẤY' : 'ĐÃ TẶNG'}
                                 </div>
                             </div>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#1E1E1E]">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                             {selectedItem.type === 'sos' && (
                                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase animate-pulse">
                                    KHẨN CẤP / TÌM ĐỒ
                                </span>
                             )}
                             {selectedItem.type === 'free' && (
                                <span className="bg-green-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase">
                                    TẶNG MIỄN PHÍ
                                </span>
                             )}
                             {selectedItem.type === 'news' && (
                                <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase">
                                    TIN TỨC XÃ
                                </span>
                             )}
                        </div>

                        <h2 className="text-2xl font-bold text-white leading-tight mb-4">
                            {selectedItem.title}
                        </h2>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-800">
                             <div className="flex items-center gap-2">
                                 <Calendar size={16} />
                                 <span>{selectedItem.time}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <MapPin size={16} className="text-brand-cyan" />
                                 <span className="text-gray-300 font-medium">{selectedItem.location}</span>
                             </div>
                        </div>

                        {/* Description */}
                        <div>
                             <h4 className="text-brand-cyan font-bold uppercase text-xs mb-3">Chi tiết nội dung</h4>
                             <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                 {selectedItem.description}
                             </p>
                        </div>
                    </div>

                    {/* Sticky Footer Actions */}
                    <div className="p-4 bg-[#121212] border-t border-gray-800 grid grid-cols-2 gap-3 shrink-0">
                        {selectedItem.phone ? (
                            <a 
                                href={`tel:${selectedItem.phone.replace(/\D/g, '')}`}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold uppercase transition-all shadow-lg active:scale-95 ${
                                    selectedItem.status === 'resolved' 
                                    ? "bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none" 
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-900/30"
                                }`}
                            >
                                 <Phone size={18} fill="currentColor" /> Liên hệ ngay
                            </a>
                        ) : (
                            <button
                                disabled
                                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold uppercase bg-gray-700 text-gray-500 cursor-not-allowed"
                            >
                                <Phone size={18} /> Chưa có SĐT
                            </button>
                        )}
                        
                        <button 
                            onClick={handleZaloShare}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold uppercase hover:bg-blue-500 transition-all shadow-lg active:scale-95"
                        >
                             <Share2 size={18} /> Chia sẻ Zalo
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CommunityPage;

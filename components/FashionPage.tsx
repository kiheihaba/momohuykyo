
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  ExternalLink, 
  MessageCircle,
  Tag,
  RefreshCw,
  AlertCircle,
  Shirt,
  Percent,
  CheckCircle2
} from 'lucide-react';

interface FashionPageProps {
  onBack: () => void;
}

interface FashionItem {
  id: string;
  name: string;      // ten_san_pham
  price: string;     // gia_tien
  discount: string;  // giam_gia
  image: string;     // hinh_anh
  link: string;      // link_affiliate
  category: string;  // loai_hang (Optional)
}

// Link CSV Google Sheet (Giữ nguyên)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1704379784&single=true&output=csv";

// Danh mục hiển thị (Tùy chỉnh theo nhu cầu)
const categories = [
  { id: "all", name: "Tất cả" },
  { id: "thoitrang", name: "Thời trang" },
  { id: "giadung", name: "Gia dụng" },
  { id: "congnghe", name: "Công nghệ" },
  { id: "khac", name: "Khác" }
];

const FashionPage: React.FC<FashionPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<FashionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zalo liên hệ (Mặc định)
  const OWNER_ZALO = "https://zalo.me/0386328473";

  // --- CSV PARSING LOGIC ---
  const parseCSV = (text: string): FashionItem[] => {
    const rows = text.split('\n');
    
    // Hàm tách cột xử lý dấu phẩy trong ngoặc kép
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
    // Helper tìm index cột không phân biệt hoa thường
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    // Mapping Keys (Cập nhật theo yêu cầu của bạn)
    const idxName = getIndex(['ten_san_pham', 'name', 'tên']);
    const idxPrice = getIndex(['gia_tien', 'price', 'giá']);
    const idxDiscount = getIndex(['giam_gia', 'discount', 'khuyen_mai']);
    const idxImage = getIndex(['hinh_anh', 'anh_san_pham', 'image', 'ảnh']);
    const idxLink = getIndex(['link_affiliate', 'link', 'shopee', 'tiktok']);
    const idxCategory = getIndex(['loai_hang', 'category', 'danh_muc']);

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            return {
                id: `prod-${index}`,
                name: getCol(idxName) || "Sản phẩm chưa cập nhật tên",
                price: getCol(idxPrice) || "Liên hệ",
                discount: getCol(idxDiscount),
                image: getCol(idxImage) || "https://placehold.co/400x400?text=Shop+Online",
                link: getCol(idxLink),
                category: getCol(idxCategory) || "Khác"
            };
        });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Lỗi kết nối dữ liệu");
        const text = await response.text();
        const data = parseCSV(text);
        setItems(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Đang cập nhật cửa hàng...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredItems = items.filter(item => {
    // 1. Lọc theo danh mục (Nếu có cột category, hiện tại logic map lỏng lẻo để hiện tất cả nếu không match)
    const itemCatLower = item.category.toLowerCase();
    const activeCatLower = activeCategory.toLowerCase();
    
    let matchesCategory = true;
    if (activeCategory !== "all") {
        // Simple includes check
        matchesCategory = itemCatLower.includes(activeCatLower);
    }

    // 2. Lọc theo tìm kiếm
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a] text-white px-4 h-16 flex items-center gap-3 shadow-md border-b border-gray-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none uppercase tracking-wide">Cửa Hàng Online</h1>
            <p className="text-xs text-brand-cyan font-medium">Săn Sale & Hàng Tuyển Chọn</p>
        </div>
        <div className="bg-brand-cyan/20 p-2 rounded-full text-brand-cyan border border-brand-cyan/50">
            <ShoppingBag size={20} />
        </div>
      </div>

      {/* 2. TRUST BANNER */}
      <div className="bg-gradient-to-r from-brand-cyan/10 to-blue-500/10 border-b border-brand-cyan/20 px-4 py-3 flex items-start gap-3">
         <CheckCircle2 className="text-brand-cyan mt-0.5 shrink-0" size={16} />
         <p className="text-sm text-gray-800 font-medium">
            Sản phẩm được <span className="font-bold">HuyKyo</span> tuyển chọn kỹ lưỡng. Mua hàng chính hãng trên các sàn TMĐT hoặc liên hệ trực tiếp.
         </p>
      </div>

      {/* 3. SEARCH & FILTER */}
      <div className="sticky top-16 z-40 bg-white shadow-sm pb-2 border-b border-gray-100">
         <div className="p-4 pb-2">
             <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-cyan transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             </div>
         </div>

         {/* Filter Tabs */}
         <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? "bg-black text-white border-black shadow-lg" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 4. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-brand-cyan" size={32} />
                <p>Đang tải cửa hàng...</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={24} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <Shirt size={48} className="mx-auto mb-3 opacity-20" />
                <p>Không tìm thấy sản phẩm nào.</p>
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredItems.map((item) => {
                // Logic kiểm tra link
                const hasAffiliateLink = item.link && (item.link.startsWith('http') || item.link.startsWith('www'));

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group"
                    >
                        {/* Discount Badge */}
                        {item.discount && (
                            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white font-black text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-0.5">
                                <Percent size={10} /> {item.discount}
                            </div>
                        )}

                        {/* Image Square */}
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Product";
                                }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {/* Info Body */}
                        <div className="p-3 flex flex-col flex-grow">
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5em] mb-2 leading-snug group-hover:text-brand-cyan transition-colors" title={item.name}>
                                {item.name}
                            </h3>
                            
                            <div className="flex items-center justify-between mt-auto mb-4">
                                <span className="text-red-600 font-extrabold text-base md:text-lg">
                                    {item.price}
                                </span>
                            </div>

                            {/* SMART BUTTON LOGIC */}
                            {hasAffiliateLink ? (
                                <a 
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-orange-200"
                                >
                                    <ShoppingBag size={14} /> Mua trên Shopee / TikTok
                                </a>
                            ) : (
                                <a 
                                    href={OWNER_ZALO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-200"
                                >
                                    <MessageCircle size={14} /> Liên hệ Người bán
                                </a>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

    </div>
  );
};

export default FashionPage;

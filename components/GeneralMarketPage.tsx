
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Filter,
  Phone,
  MessageCircle,
  Flower,
  Wrench,
  Armchair,
  Repeat,
  Package,
  RefreshCw,
  AlertCircle,
  UserCircle
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
  category: string;     // phan_loai
  status: 'ConHang' | 'DaBan'; // tinh_trang
}

// 1. NGUỒN DỮ LIỆU
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=964173450&single=true&output=csv";

// 2. DANH MỤC LỌC
const categories = [
  { id: "all", name: "TẤT CẢ", icon: <Package size={16} /> },
  { id: "CayCanh", name: "HOA & CÂY CẢNH", icon: <Flower size={16} /> },
  { id: "PhuTung", name: "PHỤ TÙNG & XE", icon: <Wrench size={16} /> },
  { id: "GiaDung", name: "ĐỒ GIA DỤNG", icon: <Armchair size={16} /> },
  { id: "DoCu", name: "THANH LÝ / ĐỒ CŨ", icon: <Repeat size={16} /> },
];

const GeneralMarketPage: React.FC<GeneralMarketPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const idxSeller = getIndex(['nguoi_ban', 'seller']);
    const idxPhone = getIndex(['sdt_lien_he', 'sdt', 'phone']);
    const idxCategory = getIndex(['phan_loai', 'loai', 'category']);
    const idxStatus = getIndex(['tinh_trang', 'status']);

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const rawStatus = getCol(idxStatus).toLowerCase();
            const status: 'ConHang' | 'DaBan' = (rawStatus.includes('daban') || rawStatus.includes('sold')) ? 'DaBan' : 'ConHang';

            return {
                id: `market-${index}`,
                name: getCol(idxName) || "Sản phẩm chưa đặt tên",
                price: getCol(idxPrice) || "Liên hệ",
                image: getCol(idxImage) || "https://placehold.co/400x400?text=Cho+Thanh+Loi",
                seller: getCol(idxSeller) || "Người bán Thạnh Lợi",
                phone: getCol(idxPhone),
                category: getCol(idxCategory), // CayCanh, PhuTung, GiaDung, DoCu
                status: status
            };
        });
    
    // Sort: Còn hàng lên trước
    return parsed.sort((a, b) => {
        if (a.status === 'DaBan' && b.status !== 'DaBan') return 1;
        if (a.status !== 'DaBan' && b.status === 'DaBan') return -1;
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

  // 4. LOGIC FILTER
  const filteredItems = items.filter(item => {
    // Filter Category
    let matchesCategory = true;
    if (activeCategory !== "all") {
        matchesCategory = item.category.trim().toLowerCase() === activeCategory.toLowerCase();
    }

    // Filter Search
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-3 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900 uppercase">CHỢ MUA SẮM</h1>
            <p className="text-xs text-gray-500">Đồ cũ, Hoa kiểng, Gia dụng...</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <ShoppingBag size={20} />
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: Mai vàng, Nhớt xe, Tủ lạnh cũ..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Category Tabs */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-orange-600 text-white border-orange-600 shadow-lg" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-orange-50"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-orange-600" size={24} />
                <p>Đang bày hàng ra chợ...</p>
            </div>
        )}

        {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-3 opacity-20" />
                <p>Chưa có sản phẩm nào trong danh mục này.</p>
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredItems.map((item) => {
                const isSold = item.status === 'DaBan';

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={`bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full relative group transition-shadow hover:shadow-lg ${isSold ? 'opacity-70 grayscale' : ''}`}
                    >
                        {/* Sold Out Overlay */}
                        {isSold && (
                            <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center pointer-events-none">
                                <span className="border-2 border-white text-white font-black text-lg px-4 py-1 uppercase -rotate-12 tracking-widest">ĐÃ BÁN</span>
                            </div>
                        )}

                        {/* Image 1:1 */}
                        <div className="aspect-square relative overflow-hidden bg-gray-200">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Cho+Thanh+Loi"; }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-3 flex flex-col flex-grow">
                            {/* Title */}
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5em] mb-1 leading-snug" title={item.name}>
                                {item.name}
                            </h3>

                            {/* Price */}
                            <div className="mb-2">
                                <span className={`text-base font-bold ${isSold ? 'text-gray-500 line-through' : 'text-red-600'}`}>
                                    {item.price}
                                </span>
                            </div>

                            {/* Seller Info */}
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-3 mt-auto pt-2 border-t border-gray-50">
                                <UserCircle size={12} />
                                <span className="truncate">Người bán: {item.seller}</span>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`flex items-center justify-center gap-1 py-2 rounded text-[10px] font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                        : "bg-green-600 text-white hover:bg-green-500"
                                    }`}
                                >
                                    <Phone size={12} /> {isSold ? 'Đã bán' : 'Mua ngay'}
                                </a>
                                <a 
                                    href={isSold ? undefined : `https://zalo.me/${item.phone}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className={`flex items-center justify-center gap-1 py-2 rounded text-[10px] font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                    }`}
                                >
                                    <MessageCircle size={12} /> Zalo
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

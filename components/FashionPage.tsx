
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ExternalLink,
  ShoppingBag,
  Tag,
  RefreshCw,
  AlertCircle,
  Shirt
} from 'lucide-react';

interface FashionPageProps {
  onBack: () => void;
}

interface FashionItem {
  id: string;
  name: string;      // ten_san_pham
  price: string;     // gia_tien
  discount: string;  // giam_gia
  image: string;     // anh_san_pham
  link: string;      // link_affiliate
  category: string;  // loai_hang
}

// Link CSV Google Sheet
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1704379784&single=true&output=csv";

// Danh mục
const categories = [
  { id: "all", name: "Tất cả" },
  { id: "nam", name: "Quần áo Nam" },
  { id: "nu", name: "Quần áo Nữ" },
  { id: "phukien", name: "Phụ kiện" },
  { id: "khac", name: "Khác" }
];

const FashionPage: React.FC<FashionPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<FashionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parser CSV (Sử dụng logic Regex mạnh mẽ tương tự PapaParse để không cần cài thêm thư viện)
  const parseCSV = (text: string): FashionItem[] => {
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
    const getIndex = (key: string) => headers.findIndex(h => h.toLowerCase().trim() === key.toLowerCase().trim());

    const idxName = getIndex('ten_san_pham');
    const idxPrice = getIndex('gia_tien');
    const idxDiscount = getIndex('giam_gia');
    const idxImage = getIndex('anh_san_pham');
    const idxLink = getIndex('link_affiliate');
    const idxCategory = getIndex('loai_hang');

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            return {
                id: `fashion-${index}`,
                name: getCol(idxName) || "Sản phẩm thời trang",
                price: getCol(idxPrice) || "Liên hệ",
                discount: getCol(idxDiscount),
                image: getCol(idxImage) || "https://placehold.co/400x400?text=No+Image",
                link: getCol(idxLink) || "#",
                category: getCol(idxCategory) || "Khác"
            };
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
        setError("Đang cập nhật sản phẩm...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredItems = items.filter(item => {
    // Chuẩn hóa category để so sánh
    const itemCatLower = item.category.toLowerCase();
    const activeCatLower = activeCategory.toLowerCase();
    
    let matchesCategory = false;
    if (activeCategory === "all") {
        matchesCategory = true;
    } else if (activeCategory === "nam") {
        matchesCategory = itemCatLower.includes("nam");
    } else if (activeCategory === "nu") {
        matchesCategory = itemCatLower.includes("nữ") || itemCatLower.includes("nu");
    } else if (activeCategory === "phukien") {
        matchesCategory = itemCatLower.includes("phụ kiện") || itemCatLower.includes("túi") || itemCatLower.includes("mũ");
    } else {
        matchesCategory = true;
    }

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-100 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#ee4d2d] text-white px-4 h-16 flex items-center gap-3 shadow-md">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none">SHOPPING ONLINE</h1>
            <p className="text-xs text-white/80">Deal hời giá tốt cho người Thạnh Lợi</p>
        </div>
        <div className="bg-white/10 p-2 rounded-full">
            <ShoppingBag size={20} />
        </div>
      </div>

      {/* 2. TRUST BADGE */}
      <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100 flex items-start gap-2">
         <Tag className="text-orange-500 mt-0.5 shrink-0" size={16} />
         <p className="text-sm text-orange-800 font-medium">
            Sản phẩm được <span className="font-bold">HuyKyo</span> tuyển chọn giá tốt nhất trên Shopee cho bà con. Mua sắm an toàn, tiết kiệm!
         </p>
      </div>

      {/* 3. SEARCH & FILTER */}
      <div className="sticky top-16 z-40 bg-white shadow-sm pb-2">
         <div className="p-4 pb-2">
             <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Tìm quần áo, giày dép..." 
                    className="w-full bg-gray-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#ee4d2d]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             </div>
         </div>

         {/* Filter Tabs */}
         <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? "bg-[#ee4d2d] text-white border-[#ee4d2d]" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   {cat.name}
                </button>
            ))}
         </div>
      </div>

      {/* 4. PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-2 py-4 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-[#ee4d2d]" size={24} />
                <p>Đang săn sale...</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <AlertCircle size={24} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredItems.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <Shirt size={48} className="mx-auto mb-3 opacity-20" />
                <p>Không tìm thấy sản phẩm nào.</p>
            </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredItems.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative group"
                >
                    {/* Discount Badge */}
                    {item.discount && (
                        <div className="absolute top-0 right-0 z-10 bg-yellow-400 text-red-600 font-bold text-[10px] px-2 py-1 shadow-sm">
                            {item.discount}
                        </div>
                    )}

                    {/* Image */}
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                            }}
                        />
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Info */}
                    <div className="p-2 flex flex-col flex-grow">
                        <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5em] mb-1 leading-snug">
                            {item.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-auto mb-3">
                            <span className="text-[#ee4d2d] font-bold text-sm md:text-base">
                                {item.price}
                            </span>
                            <span className="text-[10px] text-gray-400">Đã bán 50+</span>
                        </div>

                        {/* CTA Button */}
                        <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white py-2 rounded text-xs font-bold uppercase flex items-center justify-center gap-1 transition-colors"
                        >
                            Mua ngay <ExternalLink size={12} />
                        </a>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default FashionPage;

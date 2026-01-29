
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
  Music
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

// Danh mục dịch vụ với Icon tương ứng
const serviceCategories = [
  { id: "all", name: "Tất cả", icon: <Grid size={20} />, color: "bg-gray-100 text-gray-600" },
  { id: "Sửa chữa", name: "Sửa chữa", icon: <Wrench size={20} />, color: "bg-blue-100 text-blue-600" },
  { id: "Vận chuyển", name: "Vận chuyển", icon: <Truck size={20} />, color: "bg-orange-100 text-orange-600" },
  { id: "Làm đẹp & Y tế", name: "Làm đẹp", icon: <Scissors size={20} />, color: "bg-pink-100 text-pink-600" },
  { id: "Nông nghiệp", name: "Nông nghiệp", icon: <Wheat size={20} />, color: "bg-green-100 text-green-600" },
  { id: "Tiệc tùng", name: "Tiệc tùng", icon: <PartyPopper size={20} />, color: "bg-purple-100 text-purple-600" },
];

// Dữ liệu mẫu (Giả lập CSV để hiển thị ngay, sau này thay bằng fetch CSV)
const MOCK_DATA = `
id,loai_dich_vu,ten_tho,mo_ta_ngan,dia_chi,sdt,anh_dai_dien
ThoDien01,Sửa chữa,Chú Bảy Điện Nước,Chuyên sửa mô-tơ, đi điện âm tường, sửa ống nước rò rỉ.,Ấp 3, Thạnh Lợi,0901234567,https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200
XeOm01,Vận chuyển,Anh Tư Ba Gác,Chở hàng cồng kềnh, chuyển trọ, có mặt sau 15p.,Ngã 4 Thạnh Lợi,0912345678,https://images.unsplash.com/photo-1616432043562-3671ea0e5e84?auto=format&fit=crop&q=80&w=200
LamDep01,Làm đẹp & Y tế,Tiệm Tóc Hạnh,Cắt tóc nam nữ, làm móng, gội đầu dưỡng sinh.,Cầu Xáng,0923456789,https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=200
NongNghiep01,Nông nghiệp,Máy Cày Út Em,Nhận cày xới đất, trục ướt, giá cả bình dân.,Kênh Xáng,0934567890,https://images.unsplash.com/photo-1530267981375-2734683f6177?auto=format&fit=crop&q=80&w=200
TiecTung01,Tiệc tùng,Nấu Ăn Cô Mười,Nhận nấu đám giỗ, tiệc thôi nôi, thực đơn đa dạng.,Ấp 4,0945678901,https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=200
SuaXe01,Sửa chữa,Tiệm Sửa Xe Minh,Vá vỏ, thay nhớt, sửa chữa xe máy các loại.,Chợ Thạnh Lợi,0956789012,https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=200
`;

const ServiceListingPage: React.FC<ServiceListingPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Parse CSV Data
  useEffect(() => {
    const parseData = (csvText: string) => {
        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(','); // Simple split for mock data
        
        return rows.slice(1).map(row => {
            // Regex to handle commas inside quotes if needed, similar to FoodPage
            const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const clean = (s: string) => s ? s.trim().replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            
            return {
                id: clean(parts[0]),
                category: clean(parts[1]),
                name: clean(parts[2]),
                description: clean(parts[3]),
                location: clean(parts[4]),
                phone: clean(parts[5]),
                image: clean(parts[6]) || "https://placehold.co/200x200/eee/999?text=Thợ",
            };
        });
    };

    // In production, fetch from Google Sheet URL here. For now, use MOCK_DATA.
    const data = parseData(MOCK_DATA);
    setServices(data);
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

      {/* 3. SERVICE LISTING (List View) */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 pb-24">
        {filteredServices.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <p>Chưa tìm thấy dịch vụ nào phù hợp.</p>
            </div>
        ) : (
            filteredServices.map((item, index) => (
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

                    {/* REGULAR SERVICE CARD */}
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
            ))
        )}
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

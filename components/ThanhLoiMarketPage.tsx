
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  ShoppingBag, 
  Utensils, 
  Wrench, 
  Briefcase, 
  Car, 
  Home, 
  Bell, 
  User, 
  LayoutGrid, 
  Heart,
  Store,
  Zap,
  Tag
} from 'lucide-react';

interface ThanhLoiMarketPageProps {
  onBack: () => void;
  onOpenFood?: () => void;
  onOpenServices?: () => void;
  onOpenJobs?: () => void;
  onOpenRealEstate?: () => void;
  onOpenFashion?: () => void;
  onOpenVehicles?: () => void;
  onOpenGeneralMarket?: () => void;
}

const ThanhLoiMarketPage: React.FC<ThanhLoiMarketPageProps> = ({ 
  onBack, 
  onOpenFood, 
  onOpenServices, 
  onOpenJobs, 
  onOpenRealEstate,
  onOpenVehicles, 
  onOpenGeneralMarket
}) => {
  const [activeTab, setActiveTab] = useState('home');

  // Danh mục dịch vụ (Icon Grid)
  const categories = [
    { id: 'food', label: 'Ẩm thực', icon: <Utensils size={24} />, color: 'text-orange-500', bg: 'bg-orange-50', action: onOpenFood },
    { id: 'market', label: 'Đi chợ', icon: <Store size={24} />, color: 'text-green-600', bg: 'bg-green-50', action: onOpenGeneralMarket },
    { id: 'services', label: 'Dịch vụ', icon: <Wrench size={24} />, color: 'text-blue-500', bg: 'bg-blue-50', action: onOpenServices },
    { id: 'jobs', label: 'Việc làm', icon: <Briefcase size={24} />, color: 'text-purple-500', bg: 'bg-purple-50', action: onOpenJobs },
    { id: 'vehicles', label: 'Xe cộ', icon: <Car size={24} />, color: 'text-red-500', bg: 'bg-red-50', action: onOpenVehicles },
    { id: 'real_estate', label: 'Nhà đất', icon: <Home size={24} />, color: 'text-yellow-600', bg: 'bg-yellow-50', action: onOpenRealEstate },
  ];

  // Từ khóa Hot
  const hotKeywords = ["#CơmTấm", "#ViệcLàm", "#XeCũ", "#NhàĐất", "#RauSạch"];

  // Dữ liệu mẫu cho Feed "Tin Mới Đăng" (Giả lập dữ liệu gộp để đảm bảo ổn định)
  const feedItems = [
    {
      id: 1,
      title: "Cơm Tấm Sườn Bì Chả",
      price: "35.000đ",
      location: "Ấp 3, Thạnh Lợi",
      image: "https://images.unsplash.com/photo-1595589833215-d56795c3788a?auto=format&fit=crop&q=80&w=400",
      tag: "Ẩm thực",
      time: "Vừa đăng"
    },
    {
      id: 2,
      title: "Tuyển 5 Thợ Hồ (Lương Tuần)",
      price: "500.000đ/ngày",
      location: "Khu dân cư Mới",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400",
      tag: "Việc làm",
      time: "1 giờ trước"
    },
    {
      id: 3,
      title: "Honda Wave Alpha 2022 Chính chủ",
      price: "14.500.000đ",
      location: "Chợ Thạnh Lợi",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400",
      tag: "Xe cộ",
      time: "2 giờ trước"
    },
    {
      id: 4,
      title: "Bán đất vườn 1000m2 giá ngộp",
      price: "850 Triệu",
      location: "Đường Kênh Xáng",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
      tag: "BĐS",
      time: "3 giờ trước"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F7FA] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-800 pb-20">
       
       {/* A. HEADER */}
       <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="text-gray-600 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft size={24} />
             </button>
             <div className="flex flex-col">
                <span className="text-green-600 font-black text-lg leading-none tracking-tight">
                   CHỢ ONLINE
                </span>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <MapPin size={10} /> Thạnh Lợi - Bến Lức - Tây Ninh
                </span>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingBag size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={24} />
             </button>
          </div>
       </div>

      <div className="max-w-xl mx-auto">
        
        {/* B. HERO SECTION (SEARCH) */}
        <div className="bg-white px-4 pt-4 pb-6 rounded-b-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-6">
             <div className="relative group mb-4">
                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Hôm nay bạn muốn tìm gì?" 
                    className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-100 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-500 focus:bg-white transition-all shadow-inner outline-none" 
                 />
                 <button className="absolute inset-y-1 right-1 bg-green-600 text-white px-4 rounded-lg text-sm font-bold hover:bg-green-500 transition-colors shadow-md">
                    Tìm
                 </button>
             </div>

             {/* Hot Keywords */}
             <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 text-xs font-bold text-red-500 mr-1 whitespace-nowrap">
                   <Zap size={14} fill="currentColor" /> HOT:
                </div>
                {hotKeywords.map((kw, i) => (
                   <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap border border-gray-200 cursor-pointer hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
                      {kw}
                   </span>
                ))}
             </div>
        </div>

        {/* C. CATEGORIES GRID */}
        <div className="px-4 mb-8">
            <h3 className="font-bold text-gray-800 text-base mb-4 px-1">Danh mục chính</h3>
            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={cat.action}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.color} shadow-sm border border-transparent group-hover:border-current transition-all duration-300`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 text-center">
                            {cat.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* D. FEED SECTION */}
        <div className="px-4 pb-8">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                   Tin mới đăng <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </h3>
                <span className="text-xs text-green-600 font-bold cursor-pointer">Xem tất cả</span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {feedItems.map((item) => (
                   <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 group cursor-pointer"
                   >
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                         <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         />
                         <span className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded">
                            {item.tag}
                         </span>
                      </div>
                      <div className="p-3">
                         <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-2 min-h-[2.5em]">
                            {item.title}
                         </h4>
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-red-500 font-bold text-sm">{item.price}</span>
                         </div>
                         <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <MapPin size={10} /> 
                            <span className="truncate">{item.location}</span>
                         </div>
                         <div className="mt-2 text-[10px] text-gray-300 text-right">
                            {item.time}
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION BAR (Mobile First) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 px-6 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:max-w-xl md:mx-auto md:rounded-t-2xl">
         <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <Home size={24} fill={activeTab === 'home' ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold">Trang chủ</span>
         </button>

         <button 
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'categories' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <LayoutGrid size={24} fill={activeTab === 'categories' ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold">Danh mục</span>
         </button>

         <button 
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'saved' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <Heart size={24} fill={activeTab === 'saved' ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold">Đã lưu</span>
         </button>

         <button 
            onClick={() => setActiveTab('account')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'account' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
            <User size={24} fill={activeTab === 'account' ? "currentColor" : "none"} />
            <span className="text-[10px] font-bold">Tài khoản</span>
         </button>
      </div>

    </div>
  );
};

export default ThanhLoiMarketPage;

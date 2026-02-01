
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Utensils, 
  Wrench, 
  Briefcase, 
  Car, 
  Home, 
  Shirt, 
  MapPin,
  Search,
  ExternalLink
} from 'lucide-react';
import Footer from './Footer';

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
  onOpenFashion, 
  onOpenVehicles, 
  onOpenGeneralMarket
}) => {

  const categories = [
    {
      id: 'market',
      title: 'Chợ Mua Sắm',
      desc: 'Nông sản, Đồ cũ, Gia dụng...',
      icon: <ShoppingBag size={32} />,
      color: 'text-teal-400',
      bg: 'bg-teal-400/10',
      border: 'hover:border-teal-400/50',
      action: onOpenGeneralMarket
    },
    {
      id: 'food',
      title: 'Ẩm Thực',
      desc: 'Món ngon, Trà sữa, Ăn vặt...',
      icon: <Utensils size={32} />,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'hover:border-orange-400/50',
      action: onOpenFood
    },
    {
      id: 'fashion',
      title: 'Thời Trang',
      desc: 'Quần áo, Phụ kiện, Giày dép...',
      icon: <Shirt size={32} />,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      border: 'hover:border-pink-400/50',
      action: onOpenFashion
    },
    {
      id: 'services',
      title: 'Dịch Vụ & Thợ',
      desc: 'Sửa chữa, Làm đẹp, Vận chuyển...',
      icon: <Wrench size={32} />,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'hover:border-blue-400/50',
      action: onOpenServices
    },
    {
      id: 'jobs',
      title: 'Việc Làm',
      desc: 'Tìm việc, Tuyển dụng lao động...',
      icon: <Briefcase size={32} />,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'hover:border-purple-400/50',
      action: onOpenJobs
    },
    {
      id: 'vehicles',
      title: 'Mua Bán Xe',
      desc: 'Xe máy, Ô tô, Máy cày...',
      icon: <Car size={32} />,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'hover:border-red-400/50',
      action: onOpenVehicles
    },
    {
      id: 'real_estate',
      title: 'Nhà Đất',
      desc: 'Mua bán đất nền, Nhà ở...',
      icon: <Home size={32} />,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'hover:border-yellow-400/50',
      action: onOpenRealEstate
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto overflow-x-hidden custom-scrollbar">
       {/* Header */}
       <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Quay lại
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          CHỢ ONLINE <span className="text-green-500">THẠNH LỢI</span>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
        {/* Hero */}
        <div className="text-center mb-16 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
             >
                <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-1.5 rounded-full border border-green-500/30 text-xs font-bold uppercase tracking-wider mb-6">
                    <MapPin size={14} /> Xã Thạnh Lợi - Bến Lức - Long An
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6 leading-tight">
                    Kết nối giao thương <br/> <span className="text-green-500">Địa phương 4.0</span>
                </h1>
                
                {/* Static Search Bar */}
                <div className="max-w-xl mx-auto mb-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <input 
                            type="text" 
                            id="search" 
                            disabled
                            placeholder="Chọn danh mục bên dưới để tìm kiếm..." 
                            className="block w-full p-4 pl-12 text-sm text-gray-300 border border-gray-700 rounded-full bg-[#121212] focus:ring-green-500 focus:border-green-500 cursor-not-allowed opacity-80" 
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                </div>

                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Nền tảng kết nối trực tiếp Người bán & Người mua tại Thạnh Lợi. <br/>
                    Miễn phí - Nhanh chóng - Uy tín.
                </p>
             </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
                <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={cat.action}
                    className={`group relative bg-[#121212] border border-gray-800 rounded-2xl p-8 cursor-pointer transition-all duration-300 ${cat.border} hover:shadow-2xl hover:-translate-y-1`}
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.bg} ${cat.color} transition-transform group-hover:scale-110`}>
                        {cat.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 uppercase flex items-center gap-2">
                        {cat.title} <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" />
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {cat.desc}
                    </p>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className={`w-2 h-2 rounded-full ${cat.color.replace('text-', 'bg-')} animate-pulse`}></div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThanhLoiMarketPage;

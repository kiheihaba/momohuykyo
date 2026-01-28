
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Store, 
  MonitorPlay, 
  Palette,
  ExternalLink,
  MapPin,
  ShoppingBag,
  Zap
} from 'lucide-react';

interface AllProjectsPageProps {
  onBack: () => void;
  onOpenMarket: () => void;
}

const AllProjectsPage: React.FC<AllProjectsPageProps> = ({ onBack, onOpenMarket }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          MOMO x HUYKYO <span className="text-brand-cyan">ECOSYSTEM</span>
        </div>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">
              Hệ sinh thái <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-purple-500">Dự án & Cộng đồng</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Chúng tôi không chỉ cung cấp dịch vụ, mà còn xây dựng những nền tảng kết nối và giá trị bền vững cho cộng đồng.
            </p>
          </motion.div>
        </div>

        {/* ECOSYSTEM GRID */}
        <div className="grid grid-cols-1 gap-12">
            
            {/* ITEM 1: CHỢ ONLINE THẠNH LỢI (FEATURED - NEW) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden hover:border-green-500/50 transition-all duration-500 cursor-pointer"
              onClick={onOpenMarket}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                          alt="Chợ Online Thạnh Lợi"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-green-500 text-black font-bold px-3 py-1 uppercase text-xs rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            New Project
                        </div>
                    </div>
                    
                    <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Store className="text-green-400 w-8 h-8" />
                            <h2 className="text-3xl font-bold text-white uppercase">Chợ Online Thạnh Lợi</h2>
                        </div>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            Sàn thương mại điện tử địa phương tiên phong tại xã Thạnh Lợi. Kết nối trực tiếp người nông dân, tiểu thương với người tiêu dùng trong khu vực, loại bỏ rào cản địa lý bằng công nghệ 4.0.
                        </p>
                        <ul className="space-y-3 mb-8 text-gray-400">
                             <li className="flex items-center gap-2"><MapPin size={18} className="text-green-400"/> Giao thương nhanh chóng trong xã & huyện Bến Lức.</li>
                             <li className="flex items-center gap-2"><ShoppingBag size={18} className="text-green-400"/> Đa dạng mặt hàng: Nông sản sạch, đồ gia dụng, ẩm thực.</li>
                             <li className="flex items-center gap-2"><MonitorPlay size={18} className="text-green-400"/> Hỗ trợ Livestream bán hàng cho bà con tiểu thương.</li>
                        </ul>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenMarket(); }}
                            className="self-start flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20"
                        >
                            Tham gia Cộng đồng ngay <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ITEM 2 & 3: DIGITAL CONTENT & ART */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Content Network */}
                <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 hover:border-brand-cyan/50 transition-all duration-300 flex flex-col h-full">
                    <div className="w-14 h-14 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-6 text-brand-cyan">
                        <MonitorPlay size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase">Momo x HuyKyo <br/> Entertainment</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Hệ thống kênh nội dung số đa nền tảng (YouTube, TikTok, Facebook) chuyên về chia sẻ kiến thức AI, tư duy Solopreneur và phong cách sống hiện đại.
                    </p>
                    <div className="pt-6 border-t border-gray-800">
                      <a href="https://www.youtube.com/@HuyKyoMomo" target="_blank" rel="noreferrer" className="text-brand-cyan font-bold uppercase text-sm flex items-center gap-2 hover:gap-4 transition-all">
                          Xem kênh Youtube <ArrowLeft className="rotate-180" size={16} />
                      </a>
                    </div>
                </div>

                {/* Creative Art */}
                <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
                        <Palette size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase">Creative Art Lab</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Xưởng sáng tạo nghệ thuật số. Ứng dụng Generative AI để tạo ra các bộ sưu tập hình ảnh, video music visualizer độc bản và tài nguyên thiết kế cho cộng đồng.
                    </p>
                    <div className="pt-6 border-t border-gray-800">
                      <button className="text-purple-500 font-bold uppercase text-sm flex items-center gap-2 hover:gap-4 transition-all">
                          Khám phá Gallery <ArrowLeft className="rotate-180" size={16} />
                      </button>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AllProjectsPage;

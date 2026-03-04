
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
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar bg-noise">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 md:px-8 h-20 flex items-center justify-between">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Intro */}
        <div className="text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase mb-6 tracking-tight drop-shadow-2xl">
              Hệ sinh thái <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-purple-500 animate-shimmer bg-[length:200%_auto]">Dự án & Cộng đồng</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Chúng tôi không chỉ cung cấp dịch vụ, mà còn xây dựng những nền tảng kết nối và giá trị bền vững cho cộng đồng.
            </p>
          </motion.div>
        </div>

        {/* ECOSYSTEM GRID */}
        <div className="grid grid-cols-1 gap-12 relative z-10">
            
            {/* ITEM 1: CHỢ ONLINE THẠNH LỢI (FEATURED - NEW) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-white/10 rounded-3xl overflow-hidden hover:border-green-500/50 transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]"
              onClick={onOpenMarket}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                        <img 
                          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                          alt="Chợ Online Thạnh Lợi"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6 z-20 bg-green-500 text-black font-black px-4 py-2 uppercase text-xs tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.6)] clip-path-slant">
                            New Project
                        </div>
                    </div>
                    
                    <div className="w-full md:w-3/5 p-8 md:p-14 flex flex-col justify-center relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-all duration-300">
                                <Store className="text-green-500 w-6 h-6 group-hover:text-black transition-colors" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight group-hover:text-green-400 transition-colors">Chợ Online Thạnh Lợi</h2>
                        </div>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed border-l-2 border-green-500/30 pl-6">
                            Sàn thương mại điện tử địa phương tiên phong tại xã Thạnh Lợi. Kết nối trực tiếp người nông dân, tiểu thương với người tiêu dùng trong khu vực, loại bỏ rào cản địa lý bằng công nghệ 4.0.
                        </p>
                        <ul className="space-y-4 mb-10 text-gray-300">
                             <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="flex items-center gap-2"><MapPin size={16} className="text-green-500"/> Giao thương nhanh chóng trong xã & huyện Bến Lức.</span></li>
                             <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="flex items-center gap-2"><ShoppingBag size={16} className="text-green-500"/> Đa dạng mặt hàng: Nông sản sạch, đồ gia dụng, ẩm thực.</span></li>
                             <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <span className="flex items-center gap-2"><MonitorPlay size={16} className="text-green-500"/> Hỗ trợ Livestream bán hàng cho bà con tiểu thương.</span></li>
                        </ul>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenMarket(); }}
                            className="self-start flex items-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase text-sm hover:bg-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/40 clip-path-slant tracking-wider"
                        >
                            Tham gia Cộng đồng ngay <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ITEM 2 & 3: DIGITAL CONTENT & ART */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Content Network */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#121212] border border-white/5 rounded-3xl p-10 hover:border-brand-cyan/50 transition-all duration-500 flex flex-col h-full group hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 pointer-events-none">
                        <MonitorPlay size={120} strokeWidth={0.5} className="text-brand-cyan" />
                    </div>
                    
                    <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 text-brand-cyan border border-brand-cyan/20 group-hover:bg-brand-cyan group-hover:text-black transition-all duration-300">
                        <MonitorPlay size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Momo x HuyKyo <br/> Entertainment</h3>
                    <p className="text-gray-400 mb-8 flex-grow leading-relaxed text-lg">
                        Hệ thống kênh nội dung số đa nền tảng (YouTube, TikTok, Facebook) chuyên về chia sẻ kiến thức AI, tư duy Solopreneur và phong cách sống hiện đại.
                    </p>
                    <div className="pt-8 border-t border-white/10">
                      <a href="https://www.youtube.com/@HuyKyoMomo" target="_blank" rel="noreferrer" className="text-brand-cyan font-bold uppercase text-sm flex items-center gap-2 hover:gap-4 transition-all tracking-widest group/link">
                          Xem kênh Youtube <ArrowLeft className="rotate-180 group-hover/link:translate-x-1 transition-transform" size={16} />
                      </a>
                    </div>
                </motion.div>

                {/* Creative Art */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#121212] border border-white/5 rounded-3xl p-10 hover:border-purple-500/50 transition-all duration-500 flex flex-col h-full group hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 pointer-events-none">
                        <Palette size={120} strokeWidth={0.5} className="text-purple-500" />
                    </div>

                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-500 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                        <Palette size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Creative Art Lab</h3>
                    <p className="text-gray-400 mb-8 flex-grow leading-relaxed text-lg">
                        Xưởng sáng tạo nghệ thuật số. Ứng dụng Generative AI để tạo ra các bộ sưu tập hình ảnh, video music visualizer độc bản và tài nguyên thiết kế cho cộng đồng.
                    </p>
                    <div className="pt-8 border-t border-white/10">
                      <button className="text-purple-500 font-bold uppercase text-sm flex items-center gap-2 hover:gap-4 transition-all tracking-widest group/link">
                          Khám phá Gallery <ArrowLeft className="rotate-180 group-hover/link:translate-x-1 transition-transform" size={16} />
                      </button>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AllProjectsPage;

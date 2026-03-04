import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Video, 
  Globe, 
  Music, 
  Mic, 
  Tent, 
  Sparkles, 
  Bot, 
  Cpu, 
  Smartphone,
  Phone
} from 'lucide-react';

interface ServicePageProps {
  onBack: () => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar bg-noise">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 md:px-8 h-20 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          SERVICES <span className="text-brand-cyan">&</span> SOLUTIONS
        </div>
        <a 
          href="tel:0386328473"
          className="bg-brand-cyan text-black px-6 py-2 font-bold text-xs uppercase tracking-wide hover:bg-white transition-colors flex items-center gap-2 clip-path-slant"
        >
          <Phone size={14} /> Booking
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-cyan/10 via-[#050505] to-[#050505] opacity-50 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20 pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
            Premium Services
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase mb-6 leading-none tracking-tight drop-shadow-2xl">
            Giải pháp Toàn diện <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-brand-cyan animate-shimmer bg-[length:200%_auto]">
              Từ Kỹ thuật số đến Thực tế
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Hệ sinh thái dịch vụ đa dạng của Momo x HuyKyo đáp ứng mọi nhu cầu sáng tạo nội dung số và tổ chức sự kiện chuyên nghiệp của bạn.
          </p>
        </motion.div>
      </section>

      {/* ZONE 1: DIGITAL CREATIVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-brand-cyan/10 rounded-lg flex items-center justify-center border border-brand-cyan/20">
              <Cpu className="text-brand-cyan w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Digital Creative</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Video Creation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-white/5 p-10 rounded-3xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500 transform group-hover:scale-110">
                <Bot size={150} strokeWidth={0.5} className="text-brand-cyan" />
              </div>
              <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 text-brand-cyan border border-brand-cyan/20 group-hover:bg-brand-cyan group-hover:text-black transition-colors duration-300">
                <Video size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Sản Xuất Video AI</h3>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                Ứng dụng trí tuệ nhân tạo để tạo Video Marketing, Avatar ảo, Deepfake chuyên nghiệp. Tiết kiệm chi phí, tối ưu thời gian sản xuất cho doanh nghiệp và cá nhân.
              </p>
              <button className="text-brand-cyan font-bold uppercase text-sm tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all border-b border-brand-cyan/30 pb-1 hover:border-brand-cyan">
                Xem Demo AI <ArrowLeft className="rotate-180" size={16} />
              </button>
            </motion.div>

            {/* Web Design */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-white/5 p-10 rounded-3xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500 transform group-hover:scale-110">
                <Smartphone size={150} strokeWidth={0.5} className="text-brand-cyan" />
              </div>
              <div className="w-16 h-16 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-8 text-brand-cyan border border-brand-cyan/20 group-hover:bg-brand-cyan group-hover:text-black transition-colors duration-300">
                <Globe size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Thiết kế Website</h3>
              <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                Xây dựng Website bán hàng, Landing Page doanh nghiệp chuẩn SEO. Phong cách thiết kế hiện đại, tối ưu trải nghiệm người dùng (UX/UI) và tỷ lệ chuyển đổi.
              </p>
              <button className="text-brand-cyan font-bold uppercase text-sm tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all border-b border-brand-cyan/30 pb-1 hover:border-brand-cyan">
                Tư vấn báo giá <ArrowLeft className="rotate-180" size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ZONE 2: EVENT & LIFESTYLE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0f15] to-[#050505] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
              <Sparkles className="text-purple-500 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Event & Lifestyle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sound & Light */}
            <div className="bg-[#15151a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600" 
                  alt="Sound Light" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Music size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sound & Light</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">Âm thanh & Ánh sáng</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Hệ thống loa đài, đèn sân khấu hiện đại cho sự kiện, Party, Bar tại gia.</p>
              </div>
            </div>

            {/* Wedding & Party */}
            <div className="bg-[#15151a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1519225448526-72c6e7ce0690?auto=format&fit=crop&q=80&w=600" 
                  alt="Wedding" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Tent size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Decor</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">Rạp cưới & Tiệc tùng</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Thiết kế rạp cưới, không gian tiệc theo concept riêng, sang trọng và ấm cúng.</p>
              </div>
            </div>

            {/* MC */}
            <div className="bg-[#15151a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=600" 
                  alt="MC" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Mic size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Personnel</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">MC Sự kiện</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Đội ngũ MC chuyên nghiệp, hoạt ngôn, dẫn dắt cảm xúc và khuấy động không khí.</p>
              </div>
            </div>

            {/* Makeup */}
            <div className="bg-[#15151a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-500 group hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1487412947132-232a6951a1e9?auto=format&fit=crop&q=80&w=600" 
                  alt="Makeup" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Beauty</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">Makeup Tại nhà</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Dịch vụ trang điểm cô dâu, dự tiệc tận nơi. Phong cách tự nhiên, rạng rỡ.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 bg-brand-black text-center border-t border-white/5 bg-noise relative">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 tracking-tight">
            Sẵn sàng <span className="text-brand-cyan">Hợp tác?</span>
          </h2>
          <a 
            href="tel:0386328473"
            className="inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 font-bold uppercase tracking-widest text-lg hover:bg-brand-cyan transition-all duration-300 clip-path-slant hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
          >
            <Phone size={24} />
            Liên hệ Booking Ngay
          </a>
          <p className="mt-8 text-gray-500 text-sm tracking-wide">Hotline / Zalo: 0386.328.473</p>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
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
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest"
        >
          <ArrowLeft size={20} /> Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          SERVICES <span className="text-brand-cyan">&</span> SOLUTIONS
        </div>
        <a 
          href="tel:0386328473"
          className="bg-brand-cyan text-black px-4 py-2 font-bold text-xs uppercase tracking-wide hover:bg-white transition-colors flex items-center gap-2"
        >
          <Phone size={14} /> Booking
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-cyan/10 via-[#050505] to-[#050505] opacity-50 pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6 leading-none tracking-tight">
            Giải pháp Toàn diện <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-white to-brand-cyan">
              Từ Kỹ thuật số đến Thực tế
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Hệ sinh thái dịch vụ đa dạng của Momo x HuyKyo đáp ứng mọi nhu cầu sáng tạo nội dung số và tổ chức sự kiện chuyên nghiệp của bạn.
          </p>
        </motion.div>
      </section>

      {/* ZONE 1: DIGITAL CREATIVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Cpu className="text-brand-cyan w-8 h-8" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Digital Creative</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Video Creation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-gray-800 p-8 rounded-2xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <Bot size={100} strokeWidth={0.5} className="text-brand-cyan" />
              </div>
              <div className="w-16 h-16 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-6 text-brand-cyan border border-brand-cyan/20">
                <Video size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sản Xuất Video AI</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Ứng dụng trí tuệ nhân tạo để tạo Video Marketing, Avatar ảo, Deepfake chuyên nghiệp. Tiết kiệm chi phí, tối ưu thời gian sản xuất cho doanh nghiệp và cá nhân.
              </p>
              <button className="text-brand-cyan font-bold uppercase text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                Xem Demo AI <ArrowLeft className="rotate-180" size={16} />
              </button>
            </motion.div>

            {/* Web Design */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#121212] border border-gray-800 p-8 rounded-2xl overflow-hidden hover:border-brand-cyan/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                <Smartphone size={100} strokeWidth={0.5} className="text-brand-cyan" />
              </div>
              <div className="w-16 h-16 bg-brand-cyan/10 rounded-xl flex items-center justify-center mb-6 text-brand-cyan border border-brand-cyan/20">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Thiết kế Website</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Xây dựng Website bán hàng, Landing Page doanh nghiệp chuẩn SEO. Phong cách thiết kế hiện đại, tối ưu trải nghiệm người dùng (UX/UI) và tỷ lệ chuyển đổi.
              </p>
              <button className="text-brand-cyan font-bold uppercase text-sm tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                Tư vấn báo giá <ArrowLeft className="rotate-180" size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ZONE 2: EVENT & LIFESTYLE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f0f15] to-[#050505] border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Sparkles className="text-purple-500 w-8 h-8" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Event & Lifestyle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sound & Light */}
            <div className="bg-[#15151a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600" 
                  alt="Sound Light" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Music size={20} />
                  <span className="text-xs font-bold uppercase">Sound & Light</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Âm thanh & Ánh sáng</h3>
                <p className="text-gray-400 text-sm">Hệ thống loa đài, đèn sân khấu hiện đại cho sự kiện, Party, Bar tại gia.</p>
              </div>
            </div>

            {/* Wedding & Party */}
            <div className="bg-[#15151a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1519225448526-72c6e7ce0690?auto=format&fit=crop&q=80&w=600" 
                  alt="Wedding" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Tent size={20} />
                  <span className="text-xs font-bold uppercase">Decor</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Rạp cưới & Tiệc tùng</h3>
                <p className="text-gray-400 text-sm">Thiết kế rạp cưới, không gian tiệc theo concept riêng, sang trọng và ấm cúng.</p>
              </div>
            </div>

            {/* MC */}
            <div className="bg-[#15151a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=600" 
                  alt="MC" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Mic size={20} />
                  <span className="text-xs font-bold uppercase">Personnel</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">MC Sự kiện</h3>
                <p className="text-gray-400 text-sm">Đội ngũ MC chuyên nghiệp, hoạt ngôn, dẫn dắt cảm xúc và khuấy động không khí.</p>
              </div>
            </div>

            {/* Makeup */}
            <div className="bg-[#15151a] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-purple-900/20 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1487412947132-232a6951a1e9?auto=format&fit=crop&q=80&w=600" 
                  alt="Makeup" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                  <Sparkles size={20} />
                  <span className="text-xs font-bold uppercase">Beauty</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Makeup Tại nhà</h3>
                <p className="text-gray-400 text-sm">Dịch vụ trang điểm cô dâu, dự tiệc tận nơi. Phong cách tự nhiên, rạng rỡ.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 bg-brand-black text-center border-t border-gray-900">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-8">
          Sẵn sàng <span className="text-brand-cyan">Hợp tác?</span>
        </h2>
        <a 
          href="tel:0386328473"
          className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-lg hover:bg-brand-cyan transition-colors clip-path-slant"
        >
          <Phone size={24} />
          Liên hệ Booking Ngay
        </a>
        <p className="mt-6 text-gray-500 text-sm">Hotline / Zalo: 0386.328.473</p>
      </section>
    </div>
  );
};

export default ServicePage;
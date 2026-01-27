import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  Truck, 
  FileText, 
  Mail, 
  Cookie 
} from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const sections = [
    { id: 'collect', title: 'Thu thập thông tin' },
    { id: 'usage', title: 'Sử dụng thông tin' },
    { id: 'sharing', title: 'Chia sẻ dữ liệu' },
    { id: 'security', title: 'Bảo mật' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'contact', title: 'Liên hệ' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Quay lại Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          Momo <span className="text-brand-cyan">x</span> HuyKyo
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Title */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-sans font-bold text-white mb-4"
          >
            Chính Sách Bảo Mật
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và minh bạch trong mọi hoạt động xử lý dữ liệu.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar (Table of Contents) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="sticky top-32">
              <h3 className="text-brand-cyan font-bold uppercase text-sm mb-6 tracking-wider">Mục lục</h3>
              <ul className="space-y-4 border-l border-gray-800">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="text-gray-500 hover:text-white hover:border-brand-cyan pl-4 border-l-2 border-transparent transition-all text-sm font-medium text-left w-full py-1"
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-[800px] mx-auto bg-[#1E1E1E] rounded-2xl p-6 md:p-10 shadow-2xl border border-gray-800"
          >
            <div className="space-y-12">
              
              {/* Introduction */}
              <div className="prose prose-invert max-w-none">
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6]">
                  Chào mừng bạn đến với <strong>Momo x HuyKyo</strong>. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, bảo vệ và chia sẻ thông tin cá nhân của bạn khi bạn truy cập website hoặc mua sắm các sản phẩm Merch & Dịch vụ số của chúng tôi.
                </p>
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6]">
                  Cập nhật lần cuối: <strong>25/01/2026</strong>.
                </p>
              </div>

              {/* 1. Collection */}
              <div id="collect" className="scroll-mt-32">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <FileText className="w-6 h-6" /> 1. Thu thập thông tin
                </h2>
                <div className="text-[#E0E0E0] text-[16px] leading-[1.6] space-y-4">
                  <p>Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li><strong className="text-white">Thông tin định danh:</strong> Tên, địa chỉ email, số điện thoại (khi bạn đăng ký nhận tin hoặc đặt hàng).</li>
                    <li><strong className="text-white">Thông tin giao hàng:</strong> Địa chỉ nhận hàng, ghi chú giao hàng (đối với sản phẩm vật lý).</li>
                    <li><strong className="text-white">Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị truy cập để tối ưu hóa giao diện website.</li>
                  </ul>
                </div>
              </div>

              {/* 2. Usage */}
              <div id="usage" className="scroll-mt-32">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <Eye className="w-6 h-6" /> 2. Sử dụng thông tin
                </h2>
                <div className="text-[#E0E0E0] text-[16px] leading-[1.6]">
                  <p className="mb-4">Thông tin của bạn được sử dụng cho các mục đích minh bạch sau:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                      <strong className="block text-white mb-1">Xử lý đơn hàng</strong>
                      Xác nhận, đóng gói và giao sản phẩm Merch đến tay bạn.
                    </li>
                    <li className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                      <strong className="block text-white mb-1">Hỗ trợ khách hàng</strong>
                      Giải đáp thắc mắc, xử lý khiếu nại hoặc tư vấn dịch vụ AI.
                    </li>
                    <li className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                      <strong className="block text-white mb-1">Cải thiện trải nghiệm</strong>
                      Phân tích hành vi người dùng để nâng cấp giao diện và nội dung.
                    </li>
                    <li className="bg-[#252525] p-4 rounded-lg border border-gray-700">
                      <strong className="block text-white mb-1">Marketing (Optional)</strong>
                      Gửi thông tin về bộ sưu tập mới hoặc ưu đãi (chỉ khi bạn đồng ý).
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3. Sharing */}
              <div id="sharing" className="scroll-mt-32">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <Truck className="w-6 h-6" /> 3. Chia sẻ dữ liệu
                </h2>
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6]">
                  Chúng tôi <strong className="text-white">KHÔNG</strong> bán thông tin cá nhân của bạn cho bên thứ ba. Dữ liệu chỉ được chia sẻ trong các trường hợp giới hạn:
                </p>
                <div className="mt-4 border-l-4 border-brand-cyan pl-4 bg-[#252525]/50 py-2">
                  <p className="text-gray-300 italic">
                    "Chúng tôi chỉ cung cấp Tên, Số điện thoại và Địa chỉ cho <strong>Đơn vị vận chuyển</strong> (như GHTK, Viettel Post) để thực hiện giao hàng."
                  </p>
                </div>
              </div>

              {/* 4. Security */}
              <div id="security" className="scroll-mt-32">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <Lock className="w-6 h-6" /> 4. Bảo mật dữ liệu
                </h2>
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6] mb-4">
                  Momo x HuyKyo áp dụng các biện pháp kỹ thuật số tiên tiến để bảo vệ dữ liệu của bạn:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield size={18} className="mt-1 text-green-400 shrink-0" />
                    <span className="text-gray-300">Sử dụng giao thức mã hóa <strong>SSL/TLS</strong> cho mọi dữ liệu truyền tải.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield size={18} className="mt-1 text-green-400 shrink-0" />
                    <span className="text-gray-300">Lưu trữ dữ liệu trên hệ thống Server bảo mật cao, giới hạn quyền truy cập.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield size={18} className="mt-1 text-green-400 shrink-0" />
                    <span className="text-gray-300">Không lưu trữ thông tin thẻ tín dụng/ngân hàng trực tiếp trên hệ thống website.</span>
                  </li>
                </ul>
              </div>

              {/* 5. Cookies */}
              <div id="cookies" className="scroll-mt-32">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <Cookie className="w-6 h-6" /> 5. Cookies
                </h2>
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6]">
                  Website sử dụng Cookies để ghi nhớ giỏ hàng của bạn và các tùy chọn cá nhân hóa. Bạn có thể tắt Cookies trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm mua sắm.
                </p>
              </div>

              {/* 6. Contact */}
              <div id="contact" className="scroll-mt-32 pt-8 border-t border-gray-700">
                <h2 className="flex items-center gap-3 text-brand-cyan text-xl md:text-2xl font-bold mb-4">
                  <Mail className="w-6 h-6" /> 6. Liên hệ
                </h2>
                <p className="text-[#E0E0E0] text-[16px] leading-[1.6] mb-6">
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật hoặc muốn yêu cầu xóa dữ liệu cá nhân, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="bg-[#121212] p-6 rounded-xl inline-block w-full">
                  <p className="text-white font-bold text-lg mb-2">Bộ phận Chăm sóc Khách hàng</p>
                  <p className="text-gray-400 mb-1">Email: <span className="text-brand-cyan">contact@momohuykyo.com</span></p>
                  <p className="text-gray-400">Hotline: <span className="text-brand-cyan">0386 328 473</span></p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="py-8 text-center bg-[#121212] border-t border-gray-900 mt-12">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-brand-cyan text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-full"
        >
          <ArrowLeft size={18} /> Quay lại Trang chủ
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
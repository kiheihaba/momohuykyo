import React from 'react';
import { Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenBlog?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenBlog }) => {
  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenPrivacy) {
      onOpenPrivacy();
    }
  };

  const handleBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenBlog) {
      onOpenBlog();
    }
  }

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1">
            <span className="font-extrabold text-2xl tracking-tighter text-white block mb-6">
              Momo <span className="text-brand-cyan">x</span> HuyKyo
            </span>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Định hình tương lai Digital Solopreneur bằng kỷ luật và công nghệ AI.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@HuyKyoMomo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-black hover:bg-brand-cyan transition-all duration-300"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61585578914711" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-black hover:bg-brand-cyan transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@momohuykyo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-brand-black hover:bg-brand-cyan transition-all duration-300"
                aria-label="Tiktok"
              >
                {/* Custom Tiktok Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="lucide lucide-music"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-8 tracking-wider text-sm">Khám phá</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#about" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Về chúng tôi</a></li>
              <li><a href="#ecosystem" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Hệ sinh thái</a></li>
              <li><a href="#vision" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Tầm nhìn</a></li>
              <li>
                <a 
                  href="#blog" 
                  onClick={handleBlogClick}
                  className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-8 tracking-wider text-sm">Dịch vụ</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Digital Content</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Merchandise</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>AI Consulting</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-[1px] bg-brand-cyan transition-all duration-300"></span>Workshops</a></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold uppercase mb-8 tracking-wider text-sm">Liên hệ</h4>
             <ul className="space-y-6 text-gray-500 text-sm">
                <li className="flex items-center gap-3 group">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-black transition-colors">
                      <Phone size={14} />
                   </div>
                   <span className="group-hover:text-white transition-colors">0386328473</span>
                </li>
                <li className="flex items-center gap-3 group">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-black transition-colors">
                      <Mail size={14} />
                   </div>
                   <span className="group-hover:text-white transition-colors">contact@momohuykyo.com</span>
                </li>
                <li className="flex items-start gap-3 group">
                   <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-brand-black transition-colors shrink-0">
                      <MapPin size={14} />
                   </div>
                   <span className="group-hover:text-white transition-colors">Xã Thạnh Lợi, Huyện Bến Lức, Tỉnh Tây Ninh</span>
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs">
            © 2026 Momo x HuyKyo. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0">
             <a 
               href="#" 
               onClick={handlePrivacyClick}
               className="text-gray-600 text-xs hover:text-brand-cyan transition-colors"
             >
               Privacy Policy
             </a>
             <a href="#" className="text-gray-600 text-xs hover:text-brand-cyan transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
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
    <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <span className="font-extrabold text-2xl tracking-tighter text-white block mb-6">
              Momo <span className="text-brand-cyan">x</span> HuyKyo
            </span>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Định hình tương lai Digital Solopreneur bằng kỷ luật và công nghệ AI.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@HuyKyoMomo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-cyan transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61585578914711" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-cyan transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@momohuykyo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-cyan transition-colors"
                aria-label="Tiktok"
              >
                {/* Custom Tiktok Icon */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
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
            <h4 className="text-white font-bold uppercase mb-6">Khám phá</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#about" className="hover:text-brand-cyan transition-colors">Về chúng tôi</a></li>
              <li><a href="#ecosystem" className="hover:text-brand-cyan transition-colors">Hệ sinh thái</a></li>
              <li><a href="#vision" className="hover:text-brand-cyan transition-colors">Tầm nhìn</a></li>
              <li>
                <a 
                  href="#blog" 
                  onClick={handleBlogClick}
                  className="hover:text-brand-cyan transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase mb-6">Dịch vụ</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Digital Content</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Merchandise</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">AI Consulting</a></li>
              <li><a href="#" className="hover:text-brand-cyan transition-colors">Workshops</a></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold uppercase mb-6">Liên hệ</h4>
             <ul className="space-y-4 text-gray-500 text-sm">
                <li className="flex items-center gap-2">
                   <Phone size={16} className="text-brand-cyan shrink-0" />
                   <span className="hover:text-brand-cyan transition-colors cursor-pointer">0386328473</span>
                </li>
                <li className="flex items-center gap-2">
                   <Mail size={16} className="text-brand-cyan shrink-0" /> 
                   <span className="hover:text-brand-cyan transition-colors cursor-pointer">contact@momohuykyo.com</span>
                </li>
                <li className="flex items-start gap-2">
                   <MapPin size={16} className="text-brand-cyan shrink-0 mt-1" />
                   <span>Xã Thạnh Lợi, Huyện Bến Lức, Tỉnh Tây Ninh</span>
                </li>
             </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs">
            © 2026 Momo x HuyKyo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <a 
               href="#" 
               onClick={handlePrivacyClick}
               className="text-gray-600 text-xs hover:text-white"
             >
               Privacy Policy
             </a>
             <a href="#" className="text-gray-600 text-xs hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Trang chủ', href: '#home' },
  { label: 'CỬA HÀNG', href: '#about' }, // Href giữ nguyên nhưng sẽ bị preventDefault
  { label: 'Hệ sinh thái', href: '#ecosystem' },
  { label: 'Tầm nhìn', href: '#vision' },
];

interface NavbarProps {
  onOpenMerch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenMerch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.label === 'CỬA HÀNG') {
      e.preventDefault();
      onOpenMerch();
      setIsOpen(false);
    } else if (item.href === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="font-extrabold text-2xl tracking-tighter text-white">
              Momo <span className="text-brand-cyan">x</span> HuyKyo
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="text-gray-300 hover:text-brand-cyan px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button className="bg-brand-cyan text-brand-black px-6 py-2 font-bold uppercase text-sm tracking-wide hover:bg-white transition-colors duration-300 clip-path-slant">
              Hợp tác ngay
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-black/95 border-b border-white/10 backdrop-blur-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="text-gray-300 hover:text-brand-cyan block px-3 py-2 rounded-md text-base font-bold uppercase"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="text-brand-black bg-brand-cyan block px-3 py-2 rounded-md text-base font-bold uppercase mt-4 text-center"
            >
              Hợp tác ngay
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Music, 
  Video, 
  X, 
  Film, 
  Headphones, 
  Share2, 
  Heart,
  RefreshCw,
  AlertCircle,
  Clapperboard,
  Plane
} from 'lucide-react';

interface StudioPageProps {
  onBack: () => void;
}

// Cấu trúc dữ liệu khớp với Google Sheet
interface MediaItem {
  id: string;
  title: string;       // tieu_de
  author: string;      // tac_gia
  url: string;         // link_youtube
  thumbnail: string;   // hinh_anh
  category: string;    // loai (Am Nhac, Phim, Flycam)
  isFeatured: boolean; // noi_bat (Yes/No)
}

// 1. CẤU HÌNH LINK GOOGLE SHEET
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=2048029384&single=true&output=csv';

const filters = [
    { id: 'all', label: 'Tất cả', icon: <Film size={16} /> },
    { id: 'music', label: 'Âm Nhạc', icon: <Music size={16} /> },
    { id: 'movie', label: 'Phim & Vlog', icon: <Clapperboard size={16} /> },
    { id: 'flycam', label: 'Flycam Quê Hương', icon: <Plane size={16} /> }
];

const StudioPage: React.FC<StudioPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);
  
  // Hero Item (Bài nổi bật)
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null);

  // --- HELPER: Get YouTube ID (For Thumbnails) ---
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- HELPER: Get Embed Source (YouTube & Google Drive) ---
  const getEmbedSource = (url: string) => {
    if (!url) return null;

    // 1. Check YouTube
    const ytId = getYouTubeId(url);
    if (ytId) {
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    }

    // 2. Check Google Drive
    if (url.includes('drive.google.com')) {
      // Regex lấy File ID từ link Drive (VD: .../file/d/ID_FILE/view...)
      const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
    }

    return null;
  };

  // --- HELPER: Parse CSV ---
  const parseCSV = (text: string): MediaItem[] => {
    const rows = text.split('\n');
    
    // Hàm xử lý dòng CSV (xử lý dấu phẩy trong ngoặc kép)
    const parseLine = (line: string): string[] => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return parts.map(part => {
            let p = part.trim();
            if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
            return p.replace(/""/g, '"');
        });
    };

    if (rows.length < 2) return [];

    const headers = parseLine(rows[0]);
    // Tìm index cột không phân biệt hoa thường
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    const idxTitle = getIndex(['tieu_de', 'title', 'ten_bai']);
    const idxAuthor = getIndex(['tac_gia', 'author', 'ca_si']);
    const idxLink = getIndex(['link_youtube', 'url', 'link']);
    const idxThumb = getIndex(['hinh_anh', 'thumbnail', 'anh_bia']);
    const idxCat = getIndex(['loai', 'category', 'phan_loai']);
    const idxFeatured = getIndex(['noi_bat', 'featured', 'hot']);

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            // Lấy ID từ link Youtube để làm Thumbnail mặc định nếu không có ảnh
            const ytLink = getCol(idxLink);
            const ytId = getYouTubeId(ytLink);
            const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "https://placehold.co/600x400/1a1a1a/FFF?text=No+Image";

            return {
                id: `media-${index}`,
                title: getCol(idxTitle) || "Chưa đặt tên",
                author: getCol(idxAuthor) || "Thạnh Lợi Studio",
                url: ytLink,
                thumbnail: getCol(idxThumb) || defaultThumb,
                category: getCol(idxCat) || "Khac",
                isFeatured: getCol(idxFeatured).toLowerCase() === 'yes'
            };
        });
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const text = await response.text();
        const data = parseCSV(text);
        
        // Tách bài nổi bật (Lấy bài đầu tiên có noi_bat = Yes)
        const featured = data.find(item => item.isFeatured);
        setHeroItem(featured || null);

        // Danh sách còn lại (Có thể bao gồm cả bài featured hoặc loại bỏ tùy ý, ở đây tôi giữ lại để list đầy đủ)
        setMediaItems(data.reverse()); 
      } catch (err) {
        console.error("Error fetching studio data:", err);
        setError("Không thể tải dữ liệu Studio. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredMedia = mediaItems.filter(item => {
      if (activeFilter === 'all') return true;
      const catLower = item.category.toLowerCase();
      if (activeFilter === 'music') return catLower.includes('nhạc') || catLower.includes('music') || catLower.includes('hát');
      if (activeFilter === 'movie') return catLower.includes('phim') || catLower.includes('vlog') || catLower.includes('ký sự');
      if (activeFilter === 'flycam') return catLower.includes('flycam') || catLower.includes('cảnh');
      return true;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-white">
      
      {/* 1. HEADER (Transparent Fixed) */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black/90 to-transparent px-4 h-20 flex items-center justify-between transition-all duration-300 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 text-gray-300 hover:text-brand-cyan transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={20} /> <span className="text-sm font-bold uppercase hidden md:inline">Quay lại</span>
        </button>
        
        <div className="pointer-events-auto flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <h1 className="font-black text-sm tracking-widest uppercase text-white">
                Thạnh Lợi <span className="text-brand-cyan">Studio</span>
            </h1>
        </div>
      </div>

      {/* 2. HERO BANNER (Cinematic Featured) */}
      {!isLoading && heroItem && (
          <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
              {/* Background Image */}
              <div className="absolute inset-0">
                  <img 
                    src={heroItem.thumbnail} 
                    alt={heroItem.title} 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-[10s] ease-out group-hover:scale-105"
                  />
                  {/* Cinematic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-16 flex flex-col items-start justify-end h-full z-10">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                  >
                      <div className="inline-flex items-center gap-2 bg-brand-cyan text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(0,255,255,0.6)]">
                          <Clapperboard size={12} /> Tiêu điểm
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase mb-4 tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
                          {heroItem.title}
                      </h2>
                      <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 flex items-center gap-2">
                          <span className="text-brand-cyan">{heroItem.author}</span> • {heroItem.category}
                      </p>
                      
                      <button 
                        onClick={() => setPlayingItem(heroItem)}
                        className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-cyan transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                      >
                          <Play size={24} fill="black" /> Xem Ngay
                      </button>
                  </motion.div>
              </div>
          </section>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative z-20 -mt-10 md:-mt-20">
          
          {/* Filter Bar (Glassmorphism) */}
          <div className="flex justify-start md:justify-center overflow-x-auto scrollbar-hide mb-12">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2">
                  {filters.map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveFilter(tab.id)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                              activeFilter === tab.id 
                              ? "bg-brand-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]" 
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                      >
                          {tab.icon} {tab.label}
                      </button>
                  ))}
              </div>
          </div>

          {/* Loading & Error */}
          {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                  <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                  <p>Đang tải dữ liệu phim...</p>
              </div>
          )}

          {error && (
              <div className="flex flex-col items-center justify-center py-32 text-red-500">
                  <AlertCircle size={32} className="mb-4" />
                  <p>{error}</p>
              </div>
          )}

          {/* MEDIA GRID */}
          {!isLoading && !error && (
              <>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Film className="text-brand-cyan" /> Danh sách phát
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredMedia.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => setPlayingItem(item)}
                            className="group cursor-pointer relative"
                        >
                            {/* Thumbnail Container */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 group-hover:border-brand-cyan/50 transition-all duration-500 shadow-lg">
                                <img 
                                    src={item.thumbnail} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />
                                
                                {/* Overlay & Play Icon */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-brand-cyan/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <Play size={24} fill="black" className="text-black ml-1" />
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-gray-300 border border-white/10">
                                    {item.category}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-3">
                                <h3 className="font-bold text-white text-sm md:text-base line-clamp-1 group-hover:text-brand-cyan transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-xs mt-1">{item.author}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </>
          )}
      </div>

      {/* 4. SMART PLAYER MODAL (Lightbox) */}
      <AnimatePresence>
        {playingItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                onClick={() => setPlayingItem(null)}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setPlayingItem(null)}
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)] border border-white/10 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* VIDEO IFRAME (YOUTUBE OR DRIVE) */}
                    {(() => {
                        const embedSrc = getEmbedSource(playingItem.url);
                        if (embedSrc) {
                            return (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={embedSrc}
                                    title={playingItem.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute inset-0"
                                ></iframe>
                            );
                        } else {
                            return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                    <AlertCircle size={48} className="mb-4" />
                                    <p>Video không khả dụng hoặc link bị lỗi.</p>
                                    <p className="text-xs mt-2 text-gray-600">Link: {playingItem.url}</p>
                                </div>
                            );
                        }
                    })()}
                </motion.div>

                {/* Info Bar under Player */}
                <div className="w-full max-w-6xl mt-6 flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-1">{playingItem.title}</h2>
                        <p className="text-brand-cyan text-sm font-medium">{playingItem.author}</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors">
                            <Heart size={20} />
                        </button>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(playingItem.url);
                                alert("Đã sao chép link video!");
                            }}
                            className="p-3 bg-brand-cyan rounded-full text-black hover:bg-white transition-colors"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudioPage;

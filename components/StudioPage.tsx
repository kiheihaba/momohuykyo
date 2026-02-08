
import React, { useState, useEffect, useCallback } from 'react';
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
  Plane,
  Camera,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Info
} from 'lucide-react';

interface StudioPageProps {
  onBack: () => void;
}

// Cấu trúc dữ liệu Video/Music
interface MediaItem {
  id: string;
  title: string;       
  author: string;      
  url: string;         
  thumbnail: string;   
  category: string;    
  isFeatured: boolean; 
}

// Cấu trúc dữ liệu Ảnh (Gallery)
interface GalleryItem {
  id: string;
  title: string;      // tieu_de
  author: string;     // tac_gia
  year: string;       // nam
  image: string;      // hinh_anh
  description: string;// mo_ta
}

// CẤU HÌNH LINK GOOGLE SHEET
const VIDEO_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=2048029384&single=true&output=csv';
const GALLERY_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=723814597&single=true&output=csv';

const filters = [
    { id: 'all', label: 'Tất cả', icon: <Film size={16} /> },
    { id: 'music', label: 'Âm Nhạc', icon: <Music size={16} /> },
    { id: 'movie', label: 'Phim & Vlog', icon: <Clapperboard size={16} /> },
    { id: 'flycam', label: 'Flycam', icon: <Plane size={16} /> },
    { id: 'gallery', label: 'Ảnh Đẹp', icon: <Camera size={16} /> }
];

const StudioPage: React.FC<StudioPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Video State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null);

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // --- HELPER: Get YouTube ID ---
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- HELPER: Get Embed Source (YouTube & Drive) ---
  const getEmbedSource = (url: string) => {
    if (!url) return null;
    const ytId = getYouTubeId(url);
    if (ytId) {
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes('drive.google.com')) {
      const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
    }
    return null;
  };

  // --- HELPER: Generic CSV Line Parser ---
  const parseCSVLine = (line: string): string[] => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      return parts.map(part => {
          let p = part.trim();
          if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
          return p.replace(/""/g, '"');
      });
  };

  // --- PARSE VIDEO CSV ---
  const parseVideoCSV = (text: string): MediaItem[] => {
    const rows = text.split('\n');
    if (rows.length < 2) return [];
    const headers = parseCSVLine(rows[0]);
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    const idxTitle = getIndex(['tieu_de', 'title']);
    const idxAuthor = getIndex(['tac_gia', 'author']);
    const idxLink = getIndex(['link_youtube', 'url']);
    const idxThumb = getIndex(['hinh_anh', 'thumbnail']);
    const idxCat = getIndex(['loai', 'category']);
    const idxFeatured = getIndex(['noi_bat', 'featured']);

    return rows.slice(1).filter(r => r.trim() !== '').map((row, index) => {
        const cols = parseCSVLine(row);
        const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";
        
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

  // --- PARSE GALLERY CSV ---
  const parseGalleryCSV = (text: string): GalleryItem[] => {
    const rows = text.split('\n');
    if (rows.length < 2) return [];
    const headers = parseCSVLine(rows[0]);
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    const idxTitle = getIndex(['tieu_de', 'title']);
    const idxAuthor = getIndex(['tac_gia', 'author']);
    const idxYear = getIndex(['nam', 'year', 'nam_chup']);
    const idxImage = getIndex(['hinh_anh', 'image', 'url']);
    const idxDesc = getIndex(['mo_ta', 'description', 'story']);

    return rows.slice(1).filter(r => r.trim() !== '').map((row, index) => {
        const cols = parseCSVLine(row);
        const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

        return {
            id: `photo-${index}`,
            title: getCol(idxTitle) || "Khoảnh khắc Thạnh Lợi",
            author: getCol(idxAuthor) || "Nhiếp ảnh gia",
            year: getCol(idxYear) || "2024",
            image: getCol(idxImage) || "https://placehold.co/600x800/1a1a1a/FFF?text=Gallery",
            description: getCol(idxDesc) || "Vẻ đẹp bình dị của quê hương."
        };
    });
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchVideos = async () => {
      setIsMediaLoading(true);
      try {
        const response = await fetch(VIDEO_SHEET_URL);
        const text = await response.text();
        const data = parseVideoCSV(text);
        setHeroItem(data.find(item => item.isFeatured) || null);
        setMediaItems(data.reverse()); 
      } catch (err) { console.error("Error videos", err); } 
      finally { setIsMediaLoading(false); }
    };

    const fetchGallery = async () => {
      setIsGalleryLoading(true);
      try {
        const response = await fetch(GALLERY_SHEET_URL);
        const text = await response.text();
        const data = parseGalleryCSV(text);
        setGalleryItems(data.reverse());
      } catch (err) { console.error("Error gallery", err); }
      finally { setIsGalleryLoading(false); }
    };

    fetchVideos();
    fetchGallery();
  }, []);

  // --- GALLERY NAVIGATION ---
  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! + 1) % galleryItems.length);
  }, [galleryItems.length, selectedPhotoIndex]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length, selectedPhotoIndex]);

  // Keyboard navigation for Gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex !== null) {
        if (e.key === 'ArrowRight') handleNextPhoto();
        if (e.key === 'ArrowLeft') handlePrevPhoto();
        if (e.key === 'Escape') setSelectedPhotoIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto]);


  // --- FILTER LOGIC ---
  const filteredMedia = mediaItems.filter(item => {
      if (activeFilter === 'all' || activeFilter === 'gallery') return true;
      const catLower = item.category.toLowerCase();
      if (activeFilter === 'music') return catLower.includes('nhạc') || catLower.includes('music') || catLower.includes('hát');
      if (activeFilter === 'movie') return catLower.includes('phim') || catLower.includes('vlog') || catLower.includes('ký sự');
      if (activeFilter === 'flycam') return catLower.includes('flycam') || catLower.includes('cảnh');
      return true;
  });

  const isGalleryMode = activeFilter === 'gallery';

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-white">
      
      {/* 1. HEADER */}
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

      {/* 2. HERO BANNER (Only show if NOT in Gallery Mode) */}
      {!isGalleryMode && !isMediaLoading && heroItem && (
          <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
              <div className="absolute inset-0">
                  <img 
                    src={heroItem.thumbnail} 
                    alt={heroItem.title} 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-[10s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
              </div>
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

      {/* 3. MAIN CONTENT */}
      <div className={`max-w-[1600px] mx-auto px-4 md:px-8 py-8 relative z-20 ${!isGalleryMode ? '-mt-10 md:-mt-20' : 'mt-20'}`}>
          
          {/* Filter Bar */}
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

          {/* VIEW: VIDEO GRID */}
          {!isGalleryMode && (
              <>
                {isMediaLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                        <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                        <p>Đang tải dữ liệu phim...</p>
                    </div>
                ) : (
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
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/5 group-hover:border-brand-cyan/50 transition-all duration-500 shadow-lg">
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-brand-cyan/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <Play size={24} fill="black" className="text-black ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider text-gray-300 border border-white/10">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="font-bold text-white text-sm md:text-base line-clamp-1 group-hover:text-brand-cyan transition-colors">{item.title}</h3>
                                        <p className="text-gray-500 text-xs mt-1">{item.author}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
              </>
          )}

          {/* VIEW: GALLERY GRID (MASONRY) */}
          {isGalleryMode && (
              <>
                {isGalleryLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                        <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                        <p>Đang tải triển lãm ảnh...</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Camera className="text-brand-cyan" /> Góc Ảnh Quê Hương
                        </h3>
                        {/* Masonry Layout using CSS Columns */}
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {galleryItems.map((photo, index) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    onClick={() => setSelectedPhotoIndex(index)}
                                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in bg-gray-900 border border-white/5 hover:border-brand-cyan/30 transition-all duration-300"
                                >
                                    <img 
                                        src={photo.image} 
                                        alt={photo.title} 
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h4 className="text-white font-bold text-sm line-clamp-1">{photo.title}</h4>
                                        <div className="flex justify-between items-end mt-1">
                                            <p className="text-brand-cyan text-xs">{photo.author}</p>
                                            <span className="text-gray-400 text-[10px] bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">{photo.year}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {galleryItems.length === 0 && (
                            <div className="text-center text-gray-500 py-20">Chưa có hình ảnh nào.</div>
                        )}
                    </>
                )}
              </>
          )}
      </div>

      {/* 4. VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {playingItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                onClick={() => setPlayingItem(null)}
            >
                <button onClick={() => setPlayingItem(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 group">
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)] border border-white/10 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {(() => {
                        const embedSrc = getEmbedSource(playingItem.url);
                        if (embedSrc) {
                            return (
                                <iframe width="100%" height="100%" src={embedSrc} title={playingItem.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0"></iframe>
                            );
                        } else {
                            return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500"><AlertCircle size={48} className="mb-4" /><p>Video không khả dụng.</p></div>
                            );
                        }
                    })()}
                </motion.div>
                <div className="w-full max-w-6xl mt-6 flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-1">{playingItem.title}</h2>
                        <p className="text-brand-cyan text-sm font-medium">{playingItem.author}</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"><Heart size={20} /></button>
                        <button onClick={() => {navigator.clipboard.writeText(playingItem.url); alert("Link copied!");}} className="p-3 bg-brand-cyan rounded-full text-black hover:bg-white transition-colors"><Share2 size={20} /></button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 5. GALLERY LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && galleryItems[selectedPhotoIndex] && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center"
                onClick={() => setSelectedPhotoIndex(null)}
            >
                {/* Close Btn */}
                <button 
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-50 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Navigation Btns */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-brand-cyan/20 text-white hover:text-brand-cyan rounded-full transition-all z-50 hidden md:block"
                >
                    <ChevronLeft size={32} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-brand-cyan/20 text-white hover:text-brand-cyan rounded-full transition-all z-50 hidden md:block"
                >
                    <ChevronRight size={32} />
                </button>

                {/* Content */}
                <div 
                    className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10" 
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Main Image */}
                    <motion.img 
                        key={selectedPhotoIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={galleryItems[selectedPhotoIndex].image}
                        alt={galleryItems[selectedPhotoIndex].title}
                        className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg border border-white/5"
                    />

                    {/* Caption & Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 max-w-3xl text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">{galleryItems[selectedPhotoIndex].title}</h2>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-4">
                            <span className="flex items-center gap-1"><Camera size={14} /> {galleryItems[selectedPhotoIndex].author}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {galleryItems[selectedPhotoIndex].year}</span>
                        </div>
                        <p className="text-gray-300 font-light italic leading-relaxed text-sm md:text-base border-t border-white/10 pt-4 inline-block px-8">
                            "{galleryItems[selectedPhotoIndex].description}"
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudioPage;

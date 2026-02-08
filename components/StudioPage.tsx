
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
  Disc
} from 'lucide-react';

interface StudioPageProps {
  onBack: () => void;
}

// Cấu trúc dữ liệu khớp với Google Sheet
interface MediaItem {
  id: string;
  title: string;       // Title
  type: 'Video' | 'Music'; // Type
  artist: string;      // Artist
  url: string;         // SourceURL
  thumbnail: string;   // Thumbnail
  status: string;      // Status
}

// 1. CẤU HÌNH LINK GOOGLE SHEET
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKsrBM98OxA9UvLGqbadgJx0_uzCvOaGHDCE7FsEk3fsVzUP-u3FlS7fsQ5rN28914KcKvHVTlQcJN/pub?gid=0&single=true&output=csv';

const StudioPage: React.FC<StudioPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Video' | 'Music'>('All');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  // --- HELPER: Get YouTube ID ---
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- HELPER: Parse CSV (Robust) ---
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
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.trim()));

    const idxID = getIndex(['ID', 'id']);
    const idxTitle = getIndex(['Title', 'title', 'Tên bài hát']);
    const idxType = getIndex(['Type', 'type', 'Loại']);
    const idxArtist = getIndex(['Artist', 'artist', 'Nghệ sĩ']);
    const idxURL = getIndex(['SourceURL', 'url', 'Link']);
    const idxThumb = getIndex(['Thumbnail', 'img', 'Ảnh bìa']);
    const idxStatus = getIndex(['Status', 'status', 'Trạng thái']);

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const status = getCol(idxStatus);
            // Logic lọc: Chỉ lấy dòng có Status là "Publish"
            if (status.toLowerCase() !== 'publish') return null;

            const typeRaw = getCol(idxType);
            const type = (typeRaw.toLowerCase().includes('video')) ? 'Video' : 'Music';

            return {
                id: getCol(idxID) || Math.random().toString(36).substr(2, 9),
                title: getCol(idxTitle) || "Chưa đặt tên",
                type: type,
                artist: getCol(idxArtist) || "Momo x HuyKyo",
                url: getCol(idxURL),
                thumbnail: getCol(idxThumb) || "https://placehold.co/600x400/1a1a1a/FFF?text=No+Image",
                status: status
            };
        })
        .filter((item): item is MediaItem => item !== null); // Loại bỏ các dòng null
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
        setMediaItems(data.reverse()); // Mới nhất lên đầu
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
  const filteredMedia = activeTab === 'All' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeTab);

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f0f0f] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-white">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-gray-800 px-4 h-16 flex items-center justify-between shadow-2xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="font-black text-lg leading-none tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Thạnh Lợi Studio
            </h1>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Entertainment</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* 2. HERO / FEATURED */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=1600" 
                alt="Studio Banner" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                  <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 tracking-tighter">
                      Âm Vang <span className="text-purple-500">Đất Mẹ</span>
                  </h2>
                  <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base font-light">
                      Thư viện lưu trữ những thước phim và giai điệu mang đậm bản sắc văn hóa và con người Thạnh Lợi.
                  </p>
              </motion.div>
          </div>
      </section>

      {/* 3. FILTER BAR */}
      <div className="sticky top-16 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-gray-800 py-4 shadow-lg">
          <div className="flex justify-center gap-4">
              {[
                  { id: 'All', label: 'Tất cả', icon: <Film size={16} /> },
                  { id: 'Video', label: 'Video', icon: <Video size={16} /> },
                  { id: 'Music', label: 'Âm nhạc', icon: <Headphones size={16} /> }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          activeTab === tab.id 
                          ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-105" 
                          : "bg-[#1a1a1a] text-gray-500 hover:text-white border border-gray-800"
                      }`}
                  >
                      {tab.icon} {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {/* 4. MEDIA GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
          {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <RefreshCw className="animate-spin mb-4 text-purple-500" size={32} />
                  <p>Đang tải dữ liệu media...</p>
              </div>
          )}

          {error && (
              <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <AlertCircle size={32} className="mb-4" />
                  <p>{error}</p>
              </div>
          )}

          {!isLoading && !error && filteredMedia.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                  <Film size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Chưa có nội dung nào trong danh mục này.</p>
              </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {!isLoading && !error && filteredMedia.map((item, index) => (
                  <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setPlayingItem(item)}
                      className="group cursor-pointer"
                  >
                      {/* Card Thumbnail */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] border border-gray-800 group-hover:border-purple-500/50 transition-all duration-500">
                          <img 
                              src={item.thumbnail} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/FFF?text=Media';
                              }}
                          />
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                  <Play size={20} fill="white" className="text-white ml-1" />
                              </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              {item.type === 'Video' ? <Video size={10} className="text-blue-400" /> : <Music size={10} className="text-pink-400" />}
                              {item.type}
                          </div>
                      </div>

                      {/* Card Info */}
                      <div className="mt-3 px-1">
                          <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-purple-400 transition-colors">
                              {item.title}
                          </h3>
                          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                              <span>{item.artist}</span>
                              <span className="flex items-center gap-1 group-hover:text-white transition-colors">Phát ngay <Play size={10} /></span>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      </div>

      {/* 5. CUSTOM MEDIA PLAYER MODAL */}
      <AnimatePresence>
        {playingItem && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
                onClick={() => setPlayingItem(null)}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setPlayingItem(null)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
                >
                    <X size={24} />
                </button>

                <motion.div 
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="w-full max-w-5xl bg-[#121212] rounded-3xl overflow-hidden border border-gray-800 shadow-[0_0_50px_rgba(147,51,234,0.1)] relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* PLAYER CONTENT */}
                    <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                        {playingItem.type === 'Video' ? (
                            getYouTubeId(playingItem.url) ? (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${getYouTubeId(playingItem.url)}?autoplay=1&rel=0`}
                                    title={playingItem.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute inset-0"
                                ></iframe>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-red-500 mb-2">Video Source Error</p>
                                    <a href={playingItem.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                                        Mở trực tiếp link gốc
                                    </a>
                                </div>
                            )
                        ) : (
                            // AUDIO PLAYER INTERFACE
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black relative">
                                {/* Background Blur */}
                                <img 
                                    src={playingItem.thumbnail} 
                                    alt="Blur BG" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl"
                                />
                                
                                {/* Rotating Disc Animation */}
                                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center relative z-10 animate-[spin_10s_linear_infinite]">
                                    <div className="absolute inset-0 rounded-full border border-white/10"></div>
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img 
                                            src={playingItem.thumbnail} 
                                            alt="Album Art" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/333/FFF?text=Music'; }}
                                        />
                                    </div>
                                    {/* Center Hole */}
                                    <div className="absolute w-12 h-12 bg-[#121212] rounded-full border-2 border-gray-700 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 w-full max-w-lg px-8 relative z-10">
                                    <audio controls autoPlay className="w-full h-12 rounded-lg opacity-90 hover:opacity-100 transition-opacity">
                                        <source src={playingItem.url} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INFO BAR */}
                    <div className="p-6 md:p-8 bg-[#1a1a1a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1 line-clamp-1">{playingItem.title}</h2>
                            <p className="text-purple-400 font-medium text-sm flex items-center gap-2">
                                {playingItem.type === 'Music' ? <Music size={14} /> : <Film size={14} />} 
                                {playingItem.artist}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-xs font-bold uppercase transition-colors">
                                <Heart size={16} className="text-pink-500" /> Thích
                            </button>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(playingItem.url);
                                    alert("Đã sao chép link!");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold uppercase transition-colors"
                            >
                                <Share2 size={16} /> Chia sẻ
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudioPage;

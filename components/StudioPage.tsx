
import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';

interface StudioPageProps {
  onBack: () => void;
}

type MediaType = 'video' | 'audio';

interface MediaItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  type: MediaType;
  url: string; // YouTube ID for video, MP3 URL for audio
  duration: string;
  views: string;
}

// --- MOCK DATA (Dữ liệu mẫu - Sau này có thể thay bằng fetch CSV) ---
const MEDIA_DATA: MediaItem[] = [
  {
    id: '1',
    title: 'Thạnh Lợi Quê Tôi - Flycam 4K',
    artist: 'Momo x HuyKyo Team',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000',
    type: 'video',
    url: 'M7lc1UVf-VE', // YouTube Video ID
    duration: '04:30',
    views: '1.2K'
  },
  {
    id: '2',
    title: 'Chiều Đồng Quê (Acoustic Cover)',
    artist: 'Hương Lúa Band',
    thumbnail: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1000',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample Audio
    duration: '03:45',
    views: '850'
  },
  {
    id: '3',
    title: 'Lễ Hội Đình Làng Thạnh Lợi 2025',
    artist: 'Văn Hóa Xã',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&q=80&w=1000',
    type: 'video',
    url: 'M7lc1UVf-VE',
    duration: '15:20',
    views: '3.5K'
  },
  {
    id: '4',
    title: 'Podcast: Chuyện Người Nông Dân Số',
    artist: 'HuyKyo Host',
    thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=1000',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '25:00',
    views: '500'
  },
  {
    id: '5',
    title: 'Vẻ đẹp Bến Lức nhìn từ trên cao',
    artist: 'Momo Visuals',
    thumbnail: 'https://images.unsplash.com/photo-1495573766792-75d0b938743b?auto=format&fit=crop&q=80&w=1000',
    type: 'video',
    url: 'M7lc1UVf-VE',
    duration: '02:15',
    views: '900'
  },
  {
    id: '6',
    title: 'Bolero Thôn Quê - Tuyển Tập',
    artist: 'Nhiều nghệ sĩ',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '45:00',
    views: '5.2K'
  }
];

const StudioPage: React.FC<StudioPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio'>('all');
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);

  // Filter Logic
  const filteredMedia = activeTab === 'all' 
    ? MEDIA_DATA 
    : MEDIA_DATA.filter(item => item.type === activeTab);

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
        <div className="w-8"></div> {/* Spacer */}
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
      <div className="sticky top-16 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-gray-800 py-4">
          <div className="flex justify-center gap-4">
              {[
                  { id: 'all', label: 'Tất cả', icon: <Film size={16} /> },
                  { id: 'video', label: 'Video', icon: <Video size={16} /> },
                  { id: 'audio', label: 'Âm nhạc', icon: <Headphones size={16} /> }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMedia.map((item, index) => (
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
                          />
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                  <Play size={20} fill="white" className="text-white ml-1" />
                              </div>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              {item.type === 'video' ? <Video size={10} className="text-blue-400" /> : <Music size={10} className="text-pink-400" />}
                              {item.duration}
                          </div>
                      </div>

                      {/* Card Info */}
                      <div className="mt-3 px-1">
                          <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-purple-400 transition-colors">
                              {item.title}
                          </h3>
                          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                              <span>{item.artist}</span>
                              <span className="flex items-center gap-1"><Maximize2 size={10} /> {item.views}</span>
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
                    <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                        {playingItem.type === 'video' ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${playingItem.url}?autoplay=1&rel=0`}
                                title={playingItem.title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="absolute inset-0"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                                {/* Audio Visualizer Placeholder */}
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative animate-pulse-fast">
                                    <img 
                                        src={playingItem.thumbnail} 
                                        alt="Album Art" 
                                        className="w-full h-full rounded-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full"></div>
                                </div>
                                
                                <div className="mt-8 w-full max-w-md px-8">
                                    <audio controls autoPlay className="w-full h-10 rounded-full opacity-90 hover:opacity-100 transition-opacity">
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
                            <h2 className="text-2xl font-black text-white mb-1">{playingItem.title}</h2>
                            <p className="text-purple-400 font-medium text-sm flex items-center gap-2">
                                {playingItem.type === 'audio' ? <Music size={14} /> : <Film size={14} />} 
                                {playingItem.artist}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-xs font-bold uppercase transition-colors">
                                <Heart size={16} className="text-pink-500" /> Thích
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-bold uppercase transition-colors">
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

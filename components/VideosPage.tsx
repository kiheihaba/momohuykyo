import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Music, Plus, X, Upload, LogIn, LogOut } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, storage, auth, googleProvider } from '../firebase';

interface VideosPageProps {
  onBack: () => void;
}

const mockVideos = [
  {
    id: 'mock1',
    url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    author: 'Momo x HuyKyo',
    description: 'Khám phá thế giới solopreneur cùng tôi! #solopreneur #kinhdoanh #AI',
    likes: '14.2K',
    comments: '342',
    saves: '1.2K',
    shares: '850',
    song: 'Âm thanh gốc - Momo x HuyKyo'
  }
];

const VideoPost = ({ video, isActive }: { video: any, isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
      }
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full snap-start flex justify-center bg-black">
      <div className="relative w-full max-w-md h-full md:h-[calc(100vh-40px)] md:mt-[20px] md:rounded-xl overflow-hidden bg-gray-900 group" onClick={togglePlay}>
        <video 
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover"
          loop
          muted={false}
          playsInline
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1"></div>
             </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pointer-events-none">
          <h3 className="text-white font-bold text-lg mb-1">@{video.author || 'Momo x HuyKyo'}</h3>
          <p className="text-gray-200 text-sm mb-3 line-clamp-2">{video.description}</p>
          <div className="flex items-center gap-2 text-white text-sm">
             <Music size={16} className="animate-spin-slow" />
             <span className="truncate">{video.song || 'Âm thanh gốc - Momo x HuyKyo'}</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-2 flex flex-col items-center gap-6 pb-4">
           <div className="relative w-12 h-12 cursor-pointer" onClick={(e) => e.stopPropagation()}>
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.author || 'User')}&background=00ffff&color=000`} alt="Author" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#ff0050] rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-black">
                +
             </div>
           </div>

           <div className="flex flex-col items-center gap-1 group/btn cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 ${isLiked ? 'text-[#ff0050]' : 'text-white drop-shadow-md'}`}>
                <Heart size={32} className={isLiked ? 'fill-[#ff0050]' : 'fill-black/30'} strokeWidth={1.5} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-md">{video.likes || '12K'}</span>
           </div>

           <div className="flex flex-col items-center gap-1 group/btn cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white drop-shadow-md transition-transform active:scale-90">
                <MessageCircle size={32} className="fill-black/30" strokeWidth={1.5} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-md">{video.comments || '342'}</span>
           </div>

           <div className="flex flex-col items-center gap-1 group/btn cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 ${isSaved ? 'text-[#ffb700]' : 'text-white drop-shadow-md'}`}>
                <Bookmark size={32} className={isSaved ? 'fill-[#ffb700]' : 'fill-black/30'} strokeWidth={1.5} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-md">{video.saves || '1.2K'}</span>
           </div>

           <div className="flex flex-col items-center gap-1 group/btn cursor-pointer" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white drop-shadow-md transition-transform active:scale-90">
                <Share2 size={32} className="fill-black/30" strokeWidth={1.5} />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-md">{video.shares || '850'}</span>
           </div>
           
           <div className="mt-4 w-12 h-12 rounded-full border-[8px] border-gray-800 flex items-center justify-center animate-[spin_4s_linear_infinite]" onClick={(e) => e.stopPropagation()}>
             <img src="https://ui-avatars.com/api/?name=Momo+HuyKyo&background=00ffff&color=000" className="w-6 h-6 rounded-full" />
           </div>
        </div>
      </div>
    </div>
  );
};

const UploadModal = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: User | null }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  if (!user || user.email !== 'h8762419350@gmail.com') {
    return (
      <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
         <div className="bg-gray-900 w-full max-w-md rounded-2xl p-6 relative text-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Không có quyền</h2>
            <p className="text-gray-400 mb-6">Chỉ tài khoản quản trị viên mới có thể tải lên video.</p>
            <button onClick={onClose} className="bg-brand-cyan text-black font-bold py-2 px-6 rounded-xl hover:bg-white transition-colors">Đóng</button>
         </div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    try {
      const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        }, 
        (error) => {
          console.error("Upload error", error);
          alert("Lỗi khi tải lên. Có thể do giới hạn quyền của Firebase Storage.");
          setUploading(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'videos'), {
            url: downloadURL,
            description,
            author: user.displayName || 'Người dùng Ẩn danh',
            createdAt: serverTimestamp()
          });
          setUploading(false);
          setFile(null);
          setDescription('');
          onClose();
        }
      );
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tải lên.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
       <div className="bg-gray-900 w-full max-w-md rounded-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Tải Video Mới</h2>
          
          <div className="mb-4">
             <label className="block text-gray-300 mb-2 font-semibold">Chọn Video</label>
             <input 
               type="file" 
               accept="video/*" 
               onChange={(e) => setFile(e.target.files?.[0] || null)}
               className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-cyan file:text-black hover:file:bg-white transition-colors"
             />
          </div>
          
          <div className="mb-6">
             <label className="block text-gray-300 mb-2 font-semibold">Mô tả</label>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full bg-gray-800 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-cyan border border-gray-700 h-24 resize-none"
               placeholder="Nhập mô tả video..."
             ></textarea>
          </div>
          
          {uploading ? (
             <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
                <div className="bg-brand-cyan h-4 transition-all duration-300" style={{ width: `${progress}%` }}></div>
             </div>
          ) : (
             <button 
               onClick={handleUpload}
               disabled={!file}
               className="w-full bg-brand-cyan text-black font-bold py-3 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Upload size={20} />
               Tải Lên
             </button>
          )}
       </div>
    </div>
  );
};

const VideosPage: React.FC<VideosPageProps> = ({ onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<any[]>(mockVideos);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      const vids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (vids.length > 0) {
        setVideos(vids);
      } else {
        setVideos(mockVideos);
      }
    });
    
    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
          alert("Trình duyệt đã chặn cửa sổ đăng nhập. Vui lòng nhấn vào biểu tượng 'Mở trong tab mới' (Open in new tab) ở góc trên bên phải màn hình để đăng nhập.");
      } else {
          alert("Lỗi đăng nhập: " + error.message + ". Vui lòng thử mở ứng dụng trong tab mới.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout failed", error);
      alert("Lỗi đăng xuất: " + error.message);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop;
    const windowHeight = container.clientHeight;
    
    const newIndex = Math.round(scrollPosition / windowHeight);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
       <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent pt-6 md:pt-4 pointer-events-none">
          <button 
             onClick={onBack}
             className="text-white p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/50 transition-colors pointer-events-auto flex-shrink-0"
          >
             <ArrowLeft size={24} />
          </button>
          
          <div className="flex gap-4 font-bold text-lg drop-shadow-md pointer-events-auto">
             <span className="text-gray-400 cursor-pointer hidden md:inline">Đang Follow</span>
             <span className="text-white border-b-2 border-white pb-1 cursor-pointer">Dành cho bạn</span>
          </div>
          
          <div className="flex items-center gap-2 pointer-events-auto">
            {user ? (
               <div className="flex items-center gap-2">
                 <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}`} alt="avatar" className="w-8 h-8 rounded-full border border-white" />
                 <button 
                   onClick={handleLogout}
                   className="text-white p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/50 transition-colors"
                   title="Đăng xuất"
                 >
                   <LogOut size={20} />
                 </button>
               </div>
            ) : (
               <button 
                 onClick={handleLogin}
                 className="flex items-center gap-2 text-black px-4 py-2 rounded-full bg-white hover:bg-gray-200 font-semibold text-sm transition-colors"
               >
                 <LogIn size={18} />
                 <span className="hidden sm:inline">Đăng nhập</span>
               </button>
            )}
            {user?.email === 'h8762419350@gmail.com' && (
              <button 
                 onClick={() => setIsUploadOpen(true)}
                 className="text-black p-2 rounded-full bg-brand-cyan hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              >
                 <Plus size={24} />
              </button>
            )}
          </div>
       </div>

       <div 
         ref={containerRef}
         onScroll={handleScroll}
         className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
          {videos.map((video, index) => (
             <VideoPost 
                key={video.id} 
                video={video} 
                isActive={index === activeIndex} 
             />
          ))}
       </div>
       
       <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} user={user} />
    </div>
  );
};

export default VideosPage;

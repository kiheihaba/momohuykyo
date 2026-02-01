
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  Briefcase,
  Clock,
  Zap,
  Coffee,
  Hammer,
  Wheat,
  Truck,
  Plus,
  RefreshCw,
  AlertCircle,
  DollarSign,
  User,
  X,
  CheckCircle2,
  Building2,
  Filter
} from 'lucide-react';

interface JobListingPageProps {
  onBack: () => void;
}

interface JobItem {
  id: string;
  title: string;       // tieu_de
  salary: string;      // muc_luong
  employer: string;    // nguoi_tuyen
  location: string;    // dia_diem
  description: string; // yeu_cau + mo_ta
  postedTime: string;  // ngay_dang
  phone: string;       // sdt_lien_he
  isUrgent: boolean;   // loai_tin == 'Gap'
  image: string;       // anh_dai_dien
  category: string;    // phan_loai
}

// Link CSV Google Sheet Việc Làm
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1687973723&single=true&output=csv";

// Bộ lọc nhanh
const quickFilters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'urgent', label: '🔥 Việc gấp' },
  { id: 'high_salary', label: '💰 Lương cao' },
  { id: 'part_time', label: '⏱️ Ca gãy/Part-time' },
];

const JobListingPage: React.FC<JobListingPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  // --- LOGIC PARSE CSV ---
  const parseCSV = (text: string): JobItem[] => {
    const rows = text.split('\n');
    
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
    const getIndex = (keys: string[]) => headers.findIndex(h => keys.includes(h.toLowerCase().trim()));

    // Map Columns
    const idxTitle = getIndex(['tieu_de', 'cong_viec', 'title']);
    const idxSalary = getIndex(['muc_luong', 'luong', 'salary']);
    const idxEmployer = getIndex(['nguoi_tuyen', 'nguoi_thue', 'employer']);
    const idxLocation = getIndex(['dia_diem', 'dia_chi', 'location']);
    const idxDesc = getIndex(['yeu_cau', 'mo_ta', 'description']); // Gộp yêu cầu & mô tả
    const idxPhone = getIndex(['sdt_lien_he', 'sdt', 'phone']);
    const idxType = getIndex(['loai_tin', 'trang_thai', 'type']); // Gap / Thuong
    const idxImage = getIndex(['anh_dai_dien', 'avatar', 'image']);
    const idxCategory = getIndex(['phan_loai', 'nganh_nghe']);

    return rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const typeVal = getCol(idxType).toLowerCase();
            const isUrgent = typeVal.includes('gap') || typeVal.includes('hot') || typeVal.includes('gấp');

            // Xử lý hình ảnh fallback nếu không có
            const rawImage = getCol(idxImage);
            const rawTitle = getCol(idxTitle) || "Công việc mới";
            
            return {
                id: `job-${index}`,
                title: rawTitle,
                salary: getCol(idxSalary) || "Thỏa thuận",
                employer: getCol(idxEmployer) || "Đang cập nhật",
                location: getCol(idxLocation) || "Thạnh Lợi",
                description: getCol(idxDesc) || "Vui lòng liên hệ trực tiếp để trao đổi chi tiết công việc.",
                postedTime: "Mới đăng", 
                phone: getCol(idxPhone),
                isUrgent: isUrgent,
                image: rawImage,
                category: getCol(idxCategory) || "Lao động"
            };
        })
        .sort((a, b) => (a.isUrgent === b.isUrgent ? 0 : a.isUrgent ? -1 : 1)); // Ưu tiên tin gấp
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const text = await response.text();
        const data = parseCSV(text);
        setJobs(data);
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError("Đang cập nhật danh sách việc làm...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // --- LOGIC FILTER ---
  const filteredJobs = jobs.filter(item => {
    // 1. Filter by Quick Filter
    let matchesFilter = true;
    if (activeFilter === 'urgent') matchesFilter = item.isUrgent;
    if (activeFilter === 'high_salary') {
        // Simple heuristic: salary contains numbers > 7 or "cao"
        const sal = item.salary.toLowerCase();
        matchesFilter = sal.includes("triệu") || sal.includes("tr") || sal.includes("cao");
    }
    // 2. Filter by Search
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.employer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Helper: Get Icon based on title/category
  const getJobIcon = (job: JobItem) => {
      const t = job.title.toLowerCase();
      if (t.includes('cafe') || t.includes('phục vụ') || t.includes('bán')) return <Coffee size={24} />;
      if (t.includes('xe') || t.includes('tài') || t.includes('giao')) return <Truck size={24} />;
      if (t.includes('xây') || t.includes('hồ') || t.includes('sắt')) return <Hammer size={24} />;
      if (t.includes('vườn') || t.includes('cỏ') || t.includes('nông')) return <Wheat size={24} />;
      return <Briefcase size={24} />;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-200">
      
      {/* 1. HEADER (Dark & Sticky) */}
      <div className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-white/10 px-4 h-16 flex items-center gap-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white uppercase tracking-wide flex items-center gap-2">
                Việc Làm Thạnh Lợi <span className="bg-brand-cyan text-black text-[10px] px-2 py-0.5 rounded font-bold uppercase">Beta</span>
            </h1>
            <p className="text-xs text-gray-500 font-medium">Kết nối việc làm địa phương 24/7</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER (Dark Theme) */}
      <div className="sticky top-16 z-40 bg-[#121212]/95 backdrop-blur-md pb-4 pt-4 px-4 border-b border-white/5 shadow-xl">
         {/* Search Bar */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm việc: Phụ hồ, Bán quán, Thợ hàn..." 
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-cyan transition-colors" size={18} />
         </div>

         {/* Quick Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {quickFilters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        activeFilter === filter.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                >
                   {filter.label}
                </button>
            ))}
         </div>
      </div>

      {/* 3. JOB LIST (Glassmorphism Cards) */}
      <div className="max-w-3xl mx-auto px-4 py-6 pb-32 space-y-4">
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tìm việc làm mới...</p>
            </div>
        )}

        {error && (
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-900/50 p-4 rounded-xl text-red-400">
                <AlertCircle size={24} />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredJobs.map((job, index) => (
            <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.05)] transition-all duration-300"
            >
                {/* --- CARD ANATOMY --- */}
                
                {/* 1. Header & Main Info */}
                <div className="flex gap-4">
                    {/* Left: Avatar/Icon */}
                    <div className="shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-gray-400 overflow-hidden shadow-inner">
                            {job.image ? (
                                <img src={job.image} alt={job.employer} className="w-full h-full object-cover" />
                            ) : (
                                getJobIcon(job)
                            )}
                        </div>
                    </div>

                    {/* Center: Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-white leading-tight mb-1 truncate pr-16">
                            {job.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-[#FFD700] font-black text-sm flex items-center gap-1">
                                <DollarSign size={14} strokeWidth={3} /> {job.salary}
                             </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1 truncate max-w-[120px]">
                                <User size={12} /> {job.employer}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span className="flex items-center gap-1 truncate text-gray-400">
                                <MapPin size={12} /> {job.location}
                            </span>
                        </div>
                    </div>

                    {/* Top Right: Smart Badge */}
                    {job.isUrgent && (
                        <div className="absolute top-0 right-0">
                            <span className="bg-red-600/90 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider animate-pulse shadow-lg shadow-red-900/50">
                                🔥 Tuyển gấp
                            </span>
                        </div>
                    )}
                </div>

                {/* 2. Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/5">
                    <button 
                        onClick={() => setSelectedJob(job)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-cyan text-brand-cyan text-xs font-bold uppercase hover:bg-brand-cyan hover:text-black transition-all active:scale-95"
                    >
                        Xem chi tiết
                    </button>
                    
                    <a 
                        href={`tel:${job.phone}`}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                    >
                        <Phone size={14} fill="currentColor" /> Ứng tuyển ngay
                    </a>
                </div>

            </motion.div>
        ))}
      </div>

      {/* 4. POST BUTTON (Floating) */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center text-black z-50 border-4 border-black"
      >
          <Plus size={28} />
      </motion.a>

      {/* 5. JOB DETAIL MODAL */}
      <AnimatePresence>
        {selectedJob && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedJob(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="relative p-6 pb-4 border-b border-gray-800">
                        <button 
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="flex items-center gap-2 mb-2">
                             <span className="bg-brand-cyan/20 text-brand-cyan text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                 {selectedJob.category}
                             </span>
                             {selectedJob.isUrgent && (
                                <span className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                    GẤP
                                </span>
                             )}
                        </div>
                        
                        <h2 className="text-2xl font-black text-white leading-tight mb-2">
                            {selectedJob.title}
                        </h2>
                        
                        <p className="text-[#FFD700] font-bold text-lg flex items-center gap-1">
                            <DollarSign size={18} strokeWidth={3} /> {selectedJob.salary}
                        </p>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-[#252525] p-3 rounded-xl border border-white/5">
                                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Nhà tuyển dụng</p>
                                 <p className="text-sm text-white font-semibold flex items-center gap-2">
                                     <Building2 size={14} className="text-brand-cyan"/> {selectedJob.employer}
                                 </p>
                             </div>
                             <div className="bg-[#252525] p-3 rounded-xl border border-white/5">
                                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Địa điểm</p>
                                 <p className="text-sm text-white font-semibold flex items-center gap-2">
                                     <MapPin size={14} className="text-brand-cyan"/> {selectedJob.location}
                                 </p>
                             </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-brand-cyan font-bold uppercase text-sm mb-3 flex items-center gap-2">
                                <Zap size={16} /> Mô tả & Yêu cầu
                            </h3>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {selectedJob.description}
                                </p>
                            </div>
                        </div>
                        
                        {/* Trust Badge */}
                        <div className="flex items-center gap-2 text-green-500 text-xs bg-green-900/10 p-2 rounded-lg border border-green-500/20">
                            <CheckCircle2 size={14} />
                            <span>Tin đã được kiểm duyệt nội dung cơ bản.</span>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-800 bg-[#121212]">
                        <a 
                            href={`tel:${selectedJob.phone}`}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-900/40 hover:scale-[1.02] transition-transform"
                        >
                            <Phone size={18} fill="currentColor" /> Gọi điện ứng tuyển
                        </a>
                        <p className="text-center text-gray-500 text-[10px] mt-2">
                            Hãy nói "Tôi thấy tin tuyển dụng trên Chợ Online Thạnh Lợi"
                        </p>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default JobListingPage;

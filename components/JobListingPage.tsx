
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
  MonitorPlay,
  RefreshCw,
  AlertCircle,
  Megaphone,
  DollarSign,
  Info,
  X,
  User,
  Building2,
  CheckCircle2
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
  requirement: string; // yeu_cau / mo_ta
  postedTime: string;  // ngay_dang
  category: string;    // phan_loai
  phone: string;       // sdt_lien_he
  image: string;       // anh_dai_dien
  isUrgent: boolean;   // loai_tin == 'Gap'
}

// Link CSV Google Sheet Việc Làm
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1687973723&single=true&output=csv";

// Danh mục lọc nhanh
const quickFilters = [
  { id: "all", label: "Tất cả" },
  { id: "urgent", label: "🔥 Tuyển gấp" },
  { id: "high_salary", label: "💰 Lương cao" },
  { id: "part_time", label: "Ca gãy/Part-time" },
];

const JobListingPage: React.FC<JobListingPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  // --- PARSE CSV DATA ---
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

    const idxTitle = getIndex(['tieu_de', 'cong_viec', 'title']);
    const idxSalary = getIndex(['muc_luong', 'luong', 'salary']);
    const idxEmployer = getIndex(['nguoi_tuyen', 'nguoithue', 'employer']);
    const idxLocation = getIndex(['dia_diem', 'dia_chi', 'location']);
    const idxRequirement = getIndex(['yeu_cau', 'mo_ta', 'description']);
    const idxPhone = getIndex(['sdt_lien_he', 'sdt', 'phone']);
    const idxImage = getIndex(['anh_dai_dien', 'avatar', 'image']);
    const idxType = getIndex(['loai_tin', 'trang_thai', 'type']); // Gap vs Thuong
    const idxCategory = getIndex(['phan_loai', 'category']);

    const parsedData = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const typeVal = getCol(idxType).toLowerCase();
            const isUrgent = typeVal.includes('gap') || typeVal.includes('hot') || typeVal.includes('gấp');

            // Xử lý lương để lọc "Lương cao" (Ví dụ > 10 triệu hoặc Thỏa thuận)
            // Logic đơn giản cho UI hiển thị
            
            return {
                id: `job-${index}`,
                title: getCol(idxTitle) || "Công việc mới",
                salary: getCol(idxSalary) || "Thỏa thuận",
                employer: getCol(idxEmployer) || "Người tuyển dụng",
                location: getCol(idxLocation) || "Thạnh Lợi",
                requirement: getCol(idxRequirement) || "Liên hệ trực tiếp để trao đổi chi tiết công việc.",
                postedTime: "Mới đăng", 
                category: getCol(idxCategory) || "Khác",
                phone: getCol(idxPhone),
                image: getCol(idxImage),
                isUrgent: isUrgent
            };
        });

    // Sort: Gấp lên đầu
    return parsedData.sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0;
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed");
        const text = await response.text();
        const data = parseCSV(text);
        setJobs(data);
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- FILTER LOGIC ---
  const filteredJobs = jobs.filter(item => {
    // 1. Filter by Type
    let matchType = true;
    if (activeFilter === 'urgent') matchType = item.isUrgent;
    if (activeFilter === 'high_salary') {
        const salaryLower = item.salary.toLowerCase();
        // Logic đơn giản: chứa 'triệu' và số > 10, hoặc 'thỏa thuận'
        matchType = salaryLower.includes('thỏa thuận') || (salaryLower.includes('tr') && parseInt(salaryLower) > 8);
    }

    // 2. Search
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.employer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchType && matchSearch;
  });

  // --- HELPER: GET DEFAULT ICON ---
  const getJobIcon = (title: string) => {
      const t = title.toLowerCase();
      if (t.includes('cafe') || t.includes('phục vụ') || t.includes('pha chế')) return <Coffee size={24} />;
      if (t.includes('xây dựng') || t.includes('hồ') || t.includes('thợ')) return <Hammer size={24} />;
      if (t.includes('xe') || t.includes('tài xế') || t.includes('ship')) return <Truck size={24} />;
      if (t.includes('nông') || t.includes('vườn')) return <Wheat size={24} />;
      return <Briefcase size={24} />;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-100 font-sans">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-xl border-b border-gray-800 h-16 flex items-center gap-4 px-4 shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-black text-lg leading-none text-white uppercase tracking-wide flex items-center gap-2">
                VIỆC LÀM <span className="text-brand-cyan">THẠNH LỢI</span>
            </h1>
        </div>
      </div>

      {/* 2. HERO SEARCH & FILTER */}
      <div className="bg-[#121212] pt-6 pb-2 px-4 sticky top-16 z-40 shadow-xl border-b border-gray-800">
         {/* Search Input */}
         <div className="relative mb-4 group">
             <input 
                type="text" 
                placeholder="Tìm việc làm (VD: Phụ hồ, Bán quán...)" 
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-cyan transition-colors" size={20} />
         </div>

         {/* Filter Chips */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {quickFilters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        activeFilter === filter.id 
                        ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_10px_rgba(0,255,255,0.4)]" 
                        : "bg-[#1E1E1E] text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                    }`}
                >
                   {filter.label}
                </button>
            ))}
         </div>
      </div>

      {/* 3. JOB LIST */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 pb-32">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mb-4 text-brand-cyan" size={32} />
                <p>Đang tải danh sách việc làm...</p>
            </div>
        )}

        {!isLoading && filteredJobs.length === 0 && (
            <div className="text-center py-20 text-gray-600">
                <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy việc làm phù hợp.</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLoading && filteredJobs.map((job) => (
                <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`group relative bg-[#1a1a1a] rounded-2xl p-5 border transition-all duration-300 ${
                        job.isUrgent 
                        ? 'border-red-900/50 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]' 
                        : 'border-gray-800 hover:border-brand-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                    }`}
                >
                    {/* Badge Tuyển Gấp */}
                    {job.isUrgent && (
                        <div className="absolute top-0 right-0 z-10">
                            <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-tr-xl rounded-bl-xl shadow-lg flex items-center gap-1 animate-pulse">
                                <Zap size={10} fill="currentColor" /> GẤP
                            </div>
                        </div>
                    )}

                    {/* Header: Avatar + Title */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-700 ${!job.image ? 'bg-gray-800 text-gray-400' : 'bg-black'}`}>
                            {job.image ? (
                                <img src={job.image} alt={job.employer} className="w-full h-full object-cover" />
                            ) : (
                                getJobIcon(job.title)
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h3 className="text-base font-bold text-white leading-tight mb-1 truncate pr-8">
                                {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Building2 size={12} className="shrink-0" />
                                <span className="truncate max-w-[120px]">{job.employer}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">{job.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Salary Section */}
                    <div className="mb-5 bg-[#252525] p-3 rounded-lg border border-gray-700 flex items-center justify-between">
                         <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Mức lương</span>
                         <div className="flex items-center gap-1 text-[#FFD700] font-black text-lg drop-shadow-sm">
                             <DollarSign size={18} /> {job.salary}
                         </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedJob(job)}
                            className="bg-transparent border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-black py-2.5 rounded-xl text-xs font-bold uppercase transition-all"
                        >
                            Xem chi tiết
                        </button>
                        <a 
                            href={`tel:${job.phone}`}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 py-2.5 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            <Phone size={14} fill="currentColor" /> Ứng tuyển
                        </a>
                    </div>

                </motion.div>
            ))}
        </div>
      </div>

      {/* 4. DETAIL MODAL */}
      <AnimatePresence>
        {selectedJob && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedJob(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-gray-700 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="p-6 pb-4 border-b border-gray-800 flex justify-between items-start bg-gradient-to-b from-[#252525] to-[#1a1a1a]">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-gray-600 ${!selectedJob.image ? 'bg-gray-800 text-gray-400' : 'bg-black'}`}>
                                {selectedJob.image ? (
                                    <img src={selectedJob.image} alt={selectedJob.employer} className="w-full h-full object-cover" />
                                ) : (
                                    getJobIcon(selectedJob.title)
                                )}
                            </div>
                            <div>
                                {selectedJob.isUrgent && (
                                    <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase mb-1 inline-block">Tuyển Gấp</span>
                                )}
                                <h2 className="text-xl font-bold text-white leading-tight">{selectedJob.title}</h2>
                                <p className="text-sm text-gray-400">{selectedJob.employer}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedJob(null)}
                            className="bg-black/50 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                        {/* Salary Info */}
                        <div className="flex items-center justify-between bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded-xl mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-cyan/20 rounded-full text-brand-cyan">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Mức lương</p>
                                    <p className="text-brand-cyan font-bold text-lg">{selectedJob.salary}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold">Địa điểm</p>
                                <p className="text-white font-medium text-sm">{selectedJob.location}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2 text-white font-bold uppercase text-sm mb-2 border-l-2 border-brand-cyan pl-3">
                                    Mô tả & Yêu cầu
                                </h4>
                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-[#151515] p-4 rounded-xl border border-gray-800">
                                    {selectedJob.requirement}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-gray-800 bg-[#1a1a1a]">
                        <a 
                            href={`tel:${selectedJob.phone}`}
                            className="w-full bg-[#00C853] hover:bg-[#00E676] text-white py-4 rounded-xl text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,200,83,0.4)] animate-pulse-fast"
                        >
                            <Phone size={20} fill="currentColor" /> Gọi Ứng Tuyển Ngay
                        </a>
                        <p className="text-center text-[10px] text-gray-500 mt-2">
                            Hãy nói "Tôi tìm thấy tin từ Momo x HuyKyo" khi gọi điện.
                        </p>
                    </div>

                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Floating CTA */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan text-black rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] flex items-center justify-center z-50 border-2 border-white"
      >
          <Plus size={28} />
      </motion.a>

    </div>
  );
};

export default JobListingPage;

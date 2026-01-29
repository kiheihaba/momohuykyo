
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';

interface JobListingPageProps {
  onBack: () => void;
}

interface JobItem {
  id: string;
  title: string; // cong_viec
  salary: string; // muc_luong
  employer: string; // nguoi_tuyen
  location: string; // dia_chi
  requirement: string; // yeu_cau
  postedTime: string; // ngay_dang
  category: string; // phan_loai
  phone: string; // sdt
  isUrgent: boolean; // trang_thai (Gap / Thuong)
}

// Link CSV Google Sheet Việc Làm
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=1687973723&single=true&output=csv";

// Danh mục việc làm (Icons minh họa)
const jobCategories = [
  { id: "all", name: "Tất cả", icon: <Briefcase size={18} />, color: "bg-gray-100 text-gray-700" },
  { id: "Lao động", name: "Lao động", icon: <Hammer size={18} />, color: "bg-orange-100 text-orange-700" },
  { id: "Phục vụ", name: "Phục vụ", icon: <Coffee size={18} />, color: "bg-blue-100 text-blue-700" },
  { id: "Nông nghiệp", name: "Nông nghiệp", icon: <Wheat size={18} />, color: "bg-green-100 text-green-700" },
  { id: "Giao hàng", name: "Shipper", icon: <Truck size={18} />, color: "bg-yellow-100 text-yellow-700" },
];

const JobListingPage: React.FC<JobListingPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const text = await response.text();
        const rows = text.split('\n');

        if (rows.length > 1) {
             // Helper: Parse CSV Line safely
            const parseLine = (line: string): string[] => {
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                return parts.map(part => {
                    let p = part.trim();
                    if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
                    return p.replace(/""/g, '"');
                });
            };

            // Detect Headers
            const headers = parseLine(rows[0]);
            const getIndex = (key: string) => headers.findIndex(h => h.toLowerCase().trim() === key.toLowerCase().trim());

            // Map columns dynamically
            const idxTitle = getIndex('cong_viec');
            const idxSalary = getIndex('muc_luong');
            const idxEmployer = getIndex('nguoi_tuyen');
            const idxLocation = getIndex('dia_chi');
            const idxRequirement = getIndex('yeu_cau');
            const idxDate = getIndex('ngay_dang');
            const idxCategory = getIndex('phan_loai');
            const idxPhone = getIndex('sdt');
            const idxStatus = getIndex('trang_thai');

            const parsedJobs = rows.slice(1)
                .filter(r => r.trim() !== '')
                .map((row, index) => {
                    const cols = parseLine(row);
                    const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i] : "";

                    const status = getCol(idxStatus).toLowerCase();
                    const isUrgent = status.includes('gap') || status.includes('hot');

                    return {
                        id: `job-${index}`,
                        title: getCol(idxTitle) || "Công việc chưa đặt tên",
                        salary: getCol(idxSalary) || "Thỏa thuận",
                        employer: getCol(idxEmployer) || "Người tuyển dụng",
                        location: getCol(idxLocation) || "Thạnh Lợi",
                        requirement: getCol(idxRequirement) || "Liên hệ để biết thêm chi tiết",
                        postedTime: getCol(idxDate) || "Mới đăng",
                        category: getCol(idxCategory) || "Khác",
                        phone: getCol(idxPhone),
                        isUrgent: isUrgent
                    };
                });
            
            setJobs(parsedJobs);
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError("Không thể tải danh sách việc làm.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.employer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-100 overflow-y-auto overflow-x-hidden custom-scrollbar text-gray-900 font-sans">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900 flex items-center gap-2">
                Việc Làm Thạnh Lợi <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-black">Local</span>
            </h1>
            <p className="text-xs text-gray-500">Kết nối việc làm địa phương nhanh chóng</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: phụ hồ, bán quán,..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Horizontal Category Scroll */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {jobCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                        activeCategory === cat.id 
                        ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-200" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   <span className="flex items-center gap-2">
                     {activeCategory === cat.id && cat.icon}
                     {cat.name}
                   </span>
                </button>
            ))}
         </div>
      </div>

      {/* 3. JOB LIST */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-green-600" size={24} />
                <p>Đang tải danh sách việc làm...</p>
            </div>
        )}

        {error && (
            <div className="flex flex-col items-center justify-center py-10 text-red-500">
                <AlertCircle size={24} className="mb-2" />
                <p>{error}</p>
            </div>
        )}

        {!isLoading && !error && filteredJobs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>Chưa có việc làm nào phù hợp.</p>
            </div>
        )}

        {!isLoading && !error && filteredJobs.map((job, index) => (
            <React.Fragment key={job.id}>
                
                {/* INTERNAL AD BANNER (Position 3 -> Index 2) */}
                {index === 2 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#121212] to-[#2a2a2a] rounded-xl p-5 border border-gray-800 text-white relative overflow-hidden shadow-xl my-6"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[40px] rounded-full"></div>
                        <div className="relative z-10">
                            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase mb-2 inline-block">Cơ hội đổi đời</span>
                            <h3 className="font-black text-lg uppercase leading-tight mb-2">
                                Muốn việc nhẹ <br/> <span className="text-brand-cyan">Lương Cao?</span>
                            </h3>
                            <p className="text-gray-300 text-xs mb-4 max-w-[80%]">
                                Học nghề Content Creator & Edit Video cùng HuyKyo. Làm việc tại nhà, thu nhập không giới hạn.
                            </p>
                            <button className="bg-white text-black text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1 hover:bg-brand-cyan transition-colors">
                                <MonitorPlay size={14} /> Xem khóa học
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* JOB CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 relative"
                >
                    {/* Urgent Badge */}
                    {job.isUrgent && (
                        <div className="absolute top-0 right-0">
                            <span className="flex h-6 w-6 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 items-center justify-center">
                                    <Zap size={12} className="text-white fill-white" />
                                </span>
                            </span>
                            <span className="absolute top-1 right-8 text-[10px] font-black text-red-600 uppercase tracking-tighter">Gấp</span>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-3 pr-8">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h3>
                        <p className="text-green-600 font-extrabold text-base mt-1">{job.salary}</p>
                    </div>

                    {/* Body Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold uppercase">
                                {job.employer.charAt(0)}
                            </div>
                            {job.employer}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            {job.location}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                            <div className="mt-0.5 shrink-0 font-bold">Yêu cầu:</div>
                            {job.requirement}
                        </div>
                    </div>

                    {/* Footer & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock size={10} /> {job.postedTime}
                            </span>
                            <a 
                            href={`tel:${job.phone}`}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase shadow-lg shadow-green-200 hover:bg-green-500 active:scale-95 transition-all flex items-center gap-2"
                            >
                            <Phone size={16} fill="currentColor" /> Gọi Xin Việc
                            </a>
                    </div>
                </motion.div>

            </React.Fragment>
        ))}
      </div>

      {/* 4. FLOATING POST BUTTON */}
      <motion.a
         href="https://zalo.me/0386328473"
         target="_blank"
         rel="noreferrer"
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         whileHover={{ scale: 1.1 }}
         className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 border-4 border-white"
      >
          <Plus size={28} />
      </motion.a>
      
      <div className="fixed bottom-6 right-24 bg-black/80 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
          Đăng tin miễn phí
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
      </div>

    </div>
  );
};

export default JobListingPage;

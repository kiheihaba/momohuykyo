
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
  AlertCircle,
  Megaphone
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
  requirement: string; // yeu_cau
  postedTime: string;  // ngay_dang (hoặc auto generated)
  category: string;    // phan_loai (optional)
  phone: string;       // sdt_lien_he
  isUrgent: boolean;   // loai_tin == 'Gap'
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

  // Hàm Parser CSV mạnh mẽ (tương tự PapaParse logic)
  const parseCSV = (text: string): JobItem[] => {
    const rows = text.split('\n');
    
    // Regex split by comma ignoring quotes
    const parseLine = (line: string): string[] => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return parts.map(part => {
            let p = part.trim();
            if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
            return p.replace(/""/g, '"');
        });
    };

    if (rows.length < 2) return [];

    // 1. Detect Headers
    const headers = parseLine(rows[0]);
    const getIndex = (key: string) => headers.findIndex(h => h.toLowerCase().trim() === key.toLowerCase().trim());

    // 2. Map Columns (Ánh xạ theo yêu cầu của bạn)
    // Ưu tiên tên cột mới, fallback về tên cũ để an toàn
    const idxTitle = getIndex('tieu_de') !== -1 ? getIndex('tieu_de') : getIndex('cong_viec');
    const idxSalary = getIndex('muc_luong');
    const idxEmployer = getIndex('nguoi_tuyen');
    const idxLocation = getIndex('dia_diem') !== -1 ? getIndex('dia_diem') : getIndex('dia_chi');
    const idxRequirement = getIndex('yeu_cau');
    const idxPhone = getIndex('sdt_lien_he') !== -1 ? getIndex('sdt_lien_he') : getIndex('sdt');
    const idxType = getIndex('loai_tin') !== -1 ? getIndex('loai_tin') : getIndex('trang_thai'); // Gap vs Thuong
    const idxCategory = getIndex('phan_loai'); // Optional

    // 3. Parse Data
    const parsedData = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const typeVal = getCol(idxType).toLowerCase();
            // Logic: Nếu loai_tin chứa 'gap' -> isUrgent = true
            const isUrgent = typeVal.includes('gap') || typeVal.includes('hot');

            return {
                id: `job-${index}`,
                title: getCol(idxTitle) || "Công việc mới",
                salary: getCol(idxSalary) || "Thỏa thuận",
                employer: getCol(idxEmployer) || "Người tuyển dụng",
                location: getCol(idxLocation) || "Thạnh Lợi",
                requirement: getCol(idxRequirement) || "Vui lòng liên hệ để biết chi tiết",
                postedTime: "Mới đăng", 
                category: getCol(idxCategory) || "Khác",
                phone: getCol(idxPhone),
                isUrgent: isUrgent
            };
        });

    // 4. Sort: Urgent jobs first
    return parsedData.sort((a, b) => (a.isUrgent === b.isUrgent) ? 0 : a.isUrgent ? -1 : 1);
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
                <p>Đang cập nhật việc làm...</p>
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
                
                {/* Internal Ad Banner for Tech Courses (Interspersed) */}
                {index === 3 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#121212] rounded-xl p-5 border border-gray-800 text-white relative overflow-hidden shadow-xl my-6"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent"></div>
                         <div className="relative z-10 flex flex-col items-start">
                             <span className="bg-brand-cyan text-black font-bold text-[10px] px-2 py-0.5 uppercase mb-2">Đào tạo nghề</span>
                             <h3 className="font-bold text-lg mb-1">Học AI & Edit Video</h3>
                             <p className="text-gray-400 text-xs mb-3">Làm việc online tại nhà, thu nhập không giới hạn.</p>
                             <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-brand-cyan transition-colors">
                                 Xem khóa học
                             </button>
                         </div>
                    </motion.div>
                )}

                {/* JOB CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`bg-white rounded-xl p-4 shadow-sm border relative overflow-hidden ${
                        job.isUrgent ? 'border-red-200 shadow-red-100 ring-1 ring-red-100' : 'border-gray-200'
                    }`}
                >
                    {/* Badge Tuyển Gấp (Conditional Rendering) */}
                    {job.isUrgent && (
                        <div className="absolute top-0 right-0">
                            <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1 animate-pulse">
                                <Megaphone size={10} fill="currentColor" /> TUYỂN GẤP
                            </div>
                        </div>
                    )}

                    {/* Header: Title & Salary */}
                    <div className="mb-3 pr-8">
                        {/* tieu_de mapped to h3 */}
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                            {job.title}
                        </h3>
                        {/* muc_luong highlighted */}
                        <p className="text-amber-600 font-extrabold text-lg mt-1 flex items-center gap-1">
                            {job.salary}
                        </p>
                    </div>

                    {/* Body Info */}
                    <div className="space-y-3 mb-5">
                        {/* Employer & Location */}
                        <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold uppercase text-gray-500 border border-gray-200">
                                    {job.employer.charAt(0)}
                                </div>
                                {job.employer}
                            </div>
                            <div className="flex items-start gap-2 text-xs text-gray-500 ml-8">
                                <MapPin size={12} className="mt-0.5 shrink-0" />
                                {job.location}
                            </div>
                        </div>

                        {/* Requirement Box */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                                <Zap size={10} /> Yêu cầu
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {job.requirement}
                            </p>
                        </div>
                    </div>

                    {/* Footer & CTA Button */}
                    <div className="pt-2">
                        {/* Nút GỌI XIN VIỆC - Full width */}
                        <a 
                            href={`tel:${job.phone}`}
                            className="w-full bg-green-600 text-white py-3.5 rounded-xl text-sm font-bold uppercase shadow-lg shadow-green-200 hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Phone size={18} fill="currentColor" /> GỌI XIN VIỆC NGAY
                        </a>
                        <div className="text-center mt-2">
                             <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                <Clock size={10} /> Đăng: {job.postedTime}
                            </span>
                        </div>
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

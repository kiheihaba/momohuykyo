
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Bike,
  Car,
  Truck,
  Tractor,
  Filter,
  Calendar,
  Gauge,
  FileCheck,
  Tag,
  AlertCircle,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface VehiclePageProps {
  onBack: () => void;
}

interface VehicleItem {
  id: string;
  title: string;        // ten_xe
  price: string;        // gia_ban
  type: string;         // loai_xe (XeMay, Oto, XeTai, NongNghiep)
  year: string;         // nam_sx
  odo: string;          // so_km
  papers: boolean;      // giay_to (true = chinh chu/day du)
  condition: string;    // tinh_trang_xe (Moi/Cu)
  status: 'Available' | 'Sold'; // trang_thai (Con/DaBan)
  isUrgent: boolean;    // tin_gap
  location: string;     // dia_chi
  phone: string;        // sdt
  image: string;        // hinh_anh
}

// URL Google Sheet (Giả lập link, bạn hãy thay link thật có tab Vehicles vào đây)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJrotBdzd-po6z_Zd6fbew0pqGgdDdZjRMf7vutpfJia2aFpNyTZNdvGZxN4MfcGtRwJWUrmICvZMF/pub?gid=2048923011&single=true&output=csv";

// Bộ lọc danh mục
const vehicleCategories = [
  { id: "all", name: "Tất cả", icon: <Filter size={18} /> },
  { id: "XeMay", name: "Xe Máy", icon: <Bike size={18} /> },
  { id: "Oto", name: "Ô tô", icon: <Car size={18} /> },
  { id: "XeTai", name: "Xe Tải/Ba Gác", icon: <Truck size={18} /> },
  { id: "NongNghiep", name: "Máy Cày/Ghe", icon: <Tractor size={18} /> },
];

const priceRanges = [
  { id: "all", name: "Mọi giá" },
  { id: "low", name: "Dưới 10Tr" },
  { id: "mid", name: "10Tr - 30Tr" },
  { id: "high", name: "Trên 30Tr" },
];

const VehiclePage: React.FC<VehiclePageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parser CSV
  const parseCSV = (text: string): VehicleItem[] => {
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
    const getIndex = (key: string) => headers.findIndex(h => h.toLowerCase().trim().includes(key.toLowerCase()));

    // Mapping columns
    const idxTitle = getIndex('ten_xe');
    const idxPrice = getIndex('gia');
    const idxType = getIndex('loai_xe');
    const idxYear = getIndex('nam_sx');
    const idxOdo = getIndex('odo');
    const idxPapers = getIndex('giay_to');
    const idxCondition = getIndex('moi_cu'); // Tình trạng xe (Mới/Cũ)
    const idxStatus = getIndex('tinh_trang'); // Trạng thái bán (DaBan/Con)
    const idxUrgent = getIndex('tin_gap');
    const idxImage = getIndex('hinh_anh');
    const idxPhone = getIndex('sdt');
    const idxLocation = getIndex('dia_chi');

    const parsed = rows.slice(1)
        .filter(r => r.trim() !== '')
        .map((row, index) => {
            const cols = parseLine(row);
            const getCol = (i: number) => (i !== -1 && cols[i]) ? cols[i].trim() : "";

            const statusVal = getCol(idxStatus).toLowerCase();
            const papersVal = getCol(idxPapers).toLowerCase();
            const urgentVal = getCol(idxUrgent).toLowerCase();

            return {
                id: `veh-${index}`,
                title: getCol(idxTitle) || "Xe chưa cập nhật tên",
                price: getCol(idxPrice) || "Thương lượng",
                type: getCol(idxType) || "Khac",
                year: getCol(idxYear) || "---",
                odo: getCol(idxOdo) || "---",
                papers: papersVal.includes('co') || papersVal.includes('ok') || papersVal.includes('day du'),
                condition: getCol(idxCondition) || "Đã qua sử dụng",
                status: (statusVal.includes('da ban') || statusVal.includes('sold') ? 'Sold' : 'Available') as 'Available' | 'Sold',
                isUrgent: urgentVal.includes('co') || urgentVal.includes('gap') || urgentVal.includes('hot'),
                image: getCol(idxImage) || "https://placehold.co/600x400?text=Xe+Thanh+Loi",
                phone: getCol(idxPhone),
                location: getCol(idxLocation) || "Thạnh Lợi"
            };
        });
    
    // Sắp xếp: Tin Gấp lên đầu, Tin đã bán xuống cuối
    return parsed.sort((a, b) => {
        if (a.status === 'Sold' && b.status !== 'Sold') return 1;
        if (a.status !== 'Sold' && b.status === 'Sold') return -1;
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return 0;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        // Fallback for demo if URL is empty or fails (since this is a new sub-page request)
        if (!response.ok && SHEET_URL.includes("2048923011")) {
             // Mock data if sheet not real
             setVehicles(MOCK_VEHICLES); 
             setIsLoading(false);
             return;
        }
        
        const text = await response.text();
        const data = parseCSV(text);
        setVehicles(data);
      } catch (err) {
        console.error("Error:", err);
        // Fallback to mock data for presentation
        setVehicles(MOCK_VEHICLES);
        // setError("Đang cập nhật dữ liệu xe...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredVehicles = vehicles.filter(item => {
    // 1. Category
    const matchCat = activeCategory === "all" || 
                     item.type.toLowerCase().includes(activeCategory.toLowerCase());
    
    // 2. Search
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Price Range (Simple parsing logic)
    let matchPrice = true;
    const priceNum = parseInt(item.price.replace(/\D/g, '')); // Extract number
    if (!isNaN(priceNum)) {
        if (activePriceRange === "low") matchPrice = priceNum < 10000000;
        else if (activePriceRange === "mid") matchPrice = priceNum >= 10000000 && priceNum <= 30000000;
        else if (activePriceRange === "high") matchPrice = priceNum > 30000000;
    }

    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div className="fixed inset-0 z-[60] bg-gray-100 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans text-gray-900">
      
      {/* 1. HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
            <h1 className="font-bold text-lg leading-none text-gray-900 flex items-center gap-2 uppercase tracking-tight">
                Chợ Xe Thạnh Lợi
            </h1>
            <p className="text-xs text-gray-500 font-medium">Mua bán Xe máy - Ô tô - Máy cày</p>
        </div>
      </div>

      {/* 2. SMART FILTERS */}
      <div className="bg-white pb-4 px-4 pt-2 shadow-sm sticky top-16 z-40">
         {/* Search */}
         <div className="relative mb-4">
             <input 
                type="text" 
                placeholder="Tìm: Honda Vision, Máy cày Kubota..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
         </div>

         {/* Type Filters */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {vehicleCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 ${
                        activeCategory === cat.id 
                        ? "bg-gray-900 text-white border-gray-900 shadow-lg" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                   {cat.icon} {cat.name}
                </button>
            ))}
         </div>

         {/* Price Filters (Small tags) */}
         <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1">
            {priceRanges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => setActivePriceRange(range.id)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        activePriceRange === range.id
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
                    }`}
                >
                    {range.name}
                </button>
            ))}
         </div>
      </div>

      {/* 3. VEHICLE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <RefreshCw className="animate-spin mb-2 text-blue-600" size={24} />
                <p>Đang tải dữ liệu xe...</p>
            </div>
        )}

        {!isLoading && filteredVehicles.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <Bike size={48} className="mx-auto mb-3 opacity-20" />
                <p>Không tìm thấy xe phù hợp.</p>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredVehicles.map((item) => {
                const isSold = item.status === 'Sold';
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col relative group hover:shadow-lg transition-all duration-300 ${isSold ? 'grayscale opacity-70' : ''}`}
                    >
                        {/* IMAGE SECTION */}
                        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Xe+Thanh+Loi"; }}
                            />
                            
                            {/* Badges */}
                            {!isSold && item.isUrgent && (
                                <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-br-lg shadow-md flex items-center gap-1 z-10">
                                    <Zap size={10} fill="currentColor" /> CẦN BÁN GẤP
                                </div>
                            )}

                            {!isSold && (
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${
                                    item.condition.toLowerCase().includes('moi') || item.condition.toLowerCase() === 'new'
                                    ? "bg-blue-600 text-white" 
                                    : "bg-gray-800/80 backdrop-blur text-white"
                                }`}>
                                    {item.condition}
                                </div>
                            )}

                            {/* Verified Paper Badge */}
                            {!isSold && item.papers && (
                                <div className="absolute bottom-2 left-2 bg-green-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <FileCheck size={10} /> Giấy tờ OK
                                </div>
                            )}

                            {/* SOLD OUT OVERLAY */}
                            {isSold && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                    <span className="border-2 border-white text-white px-6 py-2 text-xl font-black uppercase -rotate-12 tracking-widest">
                                        ĐÃ BÁN
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* INFO SECTION */}
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
                                {item.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-3">
                                <p className={`font-extrabold text-lg ${isSold ? 'text-gray-500 decoration-slate-500' : 'text-[#ff424e]'}`}>
                                    {item.price}
                                </p>
                            </div>

                            {/* Specs Row */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg mb-3 border border-gray-100">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} className="text-gray-400"/>
                                    <span>{item.year}</span>
                                </div>
                                <div className="w-[1px] h-3 bg-gray-300"></div>
                                <div className="flex items-center gap-1">
                                    <Gauge size={12} className="text-gray-400"/>
                                    <span className="truncate max-w-[80px]">{item.odo} Km</span>
                                </div>
                                <div className="w-[1px] h-3 bg-gray-300"></div>
                                <div className="flex items-center gap-1 truncate">
                                    <MapPin size={12} className="text-gray-400"/>
                                    <span className="truncate">{item.location}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <a 
                                    href={isSold ? undefined : `tel:${item.phone}`}
                                    className={`flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                        : "bg-green-600 text-white hover:bg-green-500 shadow-md shadow-green-100"
                                    }`}
                                >
                                    <Phone size={14} /> Gọi điện
                                </a>
                                <a 
                                    href={isSold ? undefined : `https://zalo.me/${item.phone}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className={`flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                                        isSold 
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-100"
                                    }`}
                                >
                                    <MessageCircle size={14} /> Zalo
                                </a>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>

    </div>
  );
};

// Dữ liệu mẫu (Fallback khi không có Sheet thật)
const MOCK_VEHICLES: VehicleItem[] = [
    { id: '1', title: 'Honda Vision 2021 Chính chủ', price: '28.500.000đ', type: 'XeMay', year: '2021', odo: '12000', papers: true, condition: 'Xe Cũ', status: 'Available', isUrgent: true, image: 'https://images.unsplash.com/photo-1696230554030-84e036e65a6f?auto=format&fit=crop&q=80&w=800', phone: '0901234567', location: 'Ấp 4, Thạnh Lợi' },
    { id: '2', title: 'Xe tải Kia K250 Thùng bạt', price: '380.000.000đ', type: 'XeTai', year: '2019', odo: '45000', papers: true, condition: 'Xe Cũ', status: 'Available', isUrgent: false, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', phone: '0901234567', location: 'Chợ Thạnh Lợi' },
    { id: '3', title: 'Máy cày Kubota L5018', price: '250.000.000đ', type: 'NongNghiep', year: '2018', odo: '2000h', papers: false, condition: 'Xe Cũ', status: 'Available', isUrgent: true, image: 'https://images.unsplash.com/photo-1534234828569-2c70eb3d77cc?auto=format&fit=crop&q=80&w=800', phone: '0901234567', location: 'Kênh Xáng' },
    { id: '4', title: 'Honda Wave Alpha 2023 Mới 100%', price: '19.000.000đ', type: 'XeMay', year: '2023', odo: '0', papers: true, condition: 'Xe Mới', status: 'Available', isUrgent: false, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800', phone: '0901234567', location: 'Cửa hàng Xe máy Tám' },
    { id: '5', title: 'Exciter 150 GP 2017', price: '22.000.000đ', type: 'XeMay', year: '2017', odo: '30000', papers: true, condition: 'Xe Cũ', status: 'Sold', isUrgent: false, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800', phone: '0901234567', location: 'Ấp 3' },
];

export default VehiclePage;

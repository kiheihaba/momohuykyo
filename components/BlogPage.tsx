import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  ChevronRight, 
  Search,
  Mail
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  isFeatured?: boolean;
}

interface BlogPageProps {
  onBack: () => void;
}

const categories = ["Tất cả", "AI & Công nghệ", "Solopreneur", "Phong thủy", "Lifestyle"];

const posts: BlogPost[] = [
  {
    id: 1,
    title: "CÁCH TÔI DÙNG AI ĐỂ VIẾT KỊCH BẢN PHIM TRONG 1 GIỜ",
    excerpt: "Khám phá quy trình workflow kết hợp giữa Gemini 1.5 Pro và tư duy sáng tạo để rút ngắn 90% thời gian lên ý tưởng.",
    category: "AI & Công nghệ",
    image: "https://i.postimg.cc/k4kxh9yp/Gemini-Generated-Image-4.jpg", // Cyberpunk writing
    date: "25/01/2026",
    readTime: "7 phút đọc",
    isFeatured: true
  },
  {
    id: 2,
    title: "Tư duy Solopreneur: Cô đơn hay Tự do?",
    excerpt: "Hành trình từ bỏ văn phòng 8 tiếng để xây dựng đế chế một người. Những cạm bẫy tâm lý và cách vượt qua.",
    category: "Solopreneur",
    image: "https://i.postimg.cc/zvVzm02k/Gemini-Generated-Image-5.jpg", // Solo hacker
    date: "20/01/2026",
    readTime: "5 phút đọc"
  },
  {
    id: 3,
    title: "Góc làm việc Phong thủy cho mệnh Hỏa & Thổ",
    excerpt: "Setup góc máy tính không chỉ cần đẹp mà còn cần vượng khí. Gợi ý phối màu RGB và vật phẩm hút tài lộc.",
    category: "Phong thủy",
    image: "https://i.postimg.cc/GmQL9Nfb/Gemini-Generated-Image-6.jpg", // Fengshui desk
    date: "18/01/2026",
    readTime: "4 phút đọc"
  },
  {
    id: 4,
    title: "Top 5 Công cụ AI 'Must-Have' năm 2026",
    excerpt: "Không chỉ là ChatGPT, đây là những vũ khí bí mật giúp bạn tự động hóa quy trình kiếm tiền thụ động.",
    category: "AI & Công nghệ",
    image: "https://i.postimg.cc/pd292929/Gemini-Generated-Image-7.jpg", // AI Tools
    date: "15/01/2026",
    readTime: "6 phút đọc"
  }
];

const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const featuredPost = posts.find(p => p.isFeatured);
  const listPosts = activeCategory === "Tất cả" 
    ? posts.filter(p => !p.isFeatured) 
    : posts.filter(p => !p.isFeatured && p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto overflow-x-hidden custom-scrollbar text-[#E0E0E0]">
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 px-4 md:px-8 h-20 flex items-center justify-between shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-brand-cyan transition-colors uppercase font-bold text-sm tracking-widest group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Quay lại Trang chủ
        </button>
        <div className="text-xl font-black tracking-tighter text-white hidden md:block">
          BLOG <span className="text-brand-cyan">&</span> NEWS
        </div>
        <button className="p-2 text-white hover:text-brand-cyan transition-colors">
          <Search size={20} />
        </button>
      </div>

      <div className="pb-24">
        {/* Hero Blog Section */}
        {featuredPost && (
          <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden group cursor-pointer">
            <div className="absolute inset-0">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col justify-end h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-3 py-1 bg-brand-cyan text-black font-bold text-xs uppercase tracking-widest mb-4">
                  {featuredPost.category}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight mb-4 max-w-4xl hover:text-brand-cyan transition-colors">
                  {featuredPost.title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-gray-300 mb-8">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {featuredPost.date}</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> {featuredPost.readTime}</span>
                </div>
                <button className="inline-flex items-center gap-2 bg-brand-cyan text-black px-6 py-3 font-bold uppercase text-sm tracking-wider hover:bg-white transition-colors clip-path-slant">
                  Đọc ngay <ChevronRight size={16} />
                </button>
              </motion.div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          
          {/* Category Filter */}
          <div className="flex overflow-x-auto gap-3 pb-4 mb-12 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-brand-cyan text-black border-brand-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                    : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-[#1E1E1E] border border-gray-800 hover:border-brand-cyan/50 transition-colors rounded-lg overflow-hidden h-full"
              >
                <div className="relative aspect-video overflow-hidden cursor-pointer">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                     <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1 border border-gray-700">
                        <Tag size={10} className="text-brand-cyan" /> {post.category}
                     </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                     <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                     <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white uppercase mb-3 leading-snug group-hover:text-brand-cyan transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#E0E0E0] text-[16px] leading-[1.6] line-clamp-3 mb-6 flex-grow font-light">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-800 mt-auto">
                    <button className="text-brand-cyan text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                      Xem chi tiết <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <section className="mt-24 max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden text-center">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

            <div className="relative z-10">
              <Mail className="w-12 h-12 text-brand-cyan mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4">
                Gia nhập <span className="text-brand-cyan">2AM Club</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
                Nhận bí kíp AI, thủ thuật Solopreneur và cảm hứng sáng tạo vào mỗi sáng thứ Hai hằng tuần. Không Spam.
              </p>

              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="flex-1 bg-black/50 border border-gray-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-brand-cyan transition-colors"
                />
                <button 
                  type="button"
                  className="bg-brand-cyan text-black font-bold uppercase px-8 py-4 rounded-lg hover:bg-white transition-colors tracking-wider whitespace-nowrap"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer for Blog */}
        <div className="text-center mt-16 text-gray-600 text-sm">
          <p>© 2026 Momo x HuyKyo Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
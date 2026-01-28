
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Vision from './components/Vision';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductShowcase from './components/ProductShowcase';
import ServicePage from './components/ServicePage';
import PrivacyPolicy from './components/PrivacyPolicy';
import BlogPage from './components/BlogPage';
import AllProjectsPage from './components/AllProjectsPage';
import ThanhLoiMarketPage from './components/ThanhLoiMarketPage';

const App: React.FC = () => {
  const [showMerch, setShowMerch] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showMarket, setShowMarket] = useState(false);

  // Helper to handle view switching
  const handleOpenMerch = () => {
    setShowServices(false);
    setShowPrivacy(false);
    setShowBlog(false);
    setShowAllProjects(false);
    setShowMarket(false);
    setShowMerch(true);
  };

  const handleOpenServices = () => {
    setShowMerch(false);
    setShowPrivacy(false);
    setShowBlog(false);
    setShowAllProjects(false);
    setShowMarket(false);
    setShowServices(true);
  };

  const handleOpenPrivacy = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowBlog(false);
    setShowAllProjects(false);
    setShowMarket(false);
    setShowPrivacy(true);
  }

  const handleOpenBlog = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowPrivacy(false);
    setShowAllProjects(false);
    setShowMarket(false);
    setShowBlog(true);
  }

  const handleOpenAllProjects = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowPrivacy(false);
    setShowBlog(false);
    setShowMarket(false);
    setShowAllProjects(true);
  }

  const handleOpenMarket = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowPrivacy(false);
    setShowBlog(false);
    // Lưu ý: showAllProjects sẽ bị ẩn, nhưng luồng quay lại sẽ được xử lý
    setShowAllProjects(false); 
    setShowMarket(true);
  }

  const handleBackToHome = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowPrivacy(false);
    setShowBlog(false);
    setShowAllProjects(false);
    setShowMarket(false);
  };

  // Nếu muốn quay lại All Projects thay vì Home
  const handleBackToProjects = () => {
    setShowMarket(false);
    setShowAllProjects(true);
  }

  if (showMerch) {
    return <ProductShowcase onBack={handleBackToHome} />;
  }

  if (showServices) {
    return <ServicePage onBack={handleBackToHome} />;
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={handleBackToHome} />;
  }

  if (showBlog) {
    return <BlogPage onBack={handleBackToHome} />;
  }

  if (showMarket) {
    return <ThanhLoiMarketPage onBack={handleBackToProjects} />;
  }

  if (showAllProjects) {
    return <AllProjectsPage onBack={handleBackToHome} onOpenMarket={handleOpenMarket} />;
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-brand-cyan selection:text-black">
      <Navbar onOpenMerch={handleOpenMerch} />
      <main>
        <Hero />
        <About />
        <Vision />
        <Services 
          onOpenMerch={handleOpenMerch} 
          onOpenServices={handleOpenServices}
          onViewAllProjects={handleOpenAllProjects} 
        />
        <Testimonials />
      </main>
      <Footer 
        onOpenPrivacy={handleOpenPrivacy} 
        onOpenBlog={handleOpenBlog}
      />
    </div>
  );
};

export default App;

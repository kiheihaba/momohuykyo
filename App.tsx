
import React, { useState, useEffect } from 'react';
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
import FoodBeveragePage from './components/FoodBeveragePage';
import ServiceListingPage from './components/ServiceListingPage';
import JobListingPage from './components/JobListingPage';
import RealEstatePage from './components/RealEstatePage';
import FashionPage from './components/FashionPage';
import VehiclePage from './components/VehiclePage';
import GeneralMarketPage from './components/GeneralMarketPage';
import CommunityPage from './components/CommunityPage';
import StudioPage from './components/StudioPage';

const App: React.FC = () => {
  const [showMerch, setShowMerch] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showFoodPage, setShowFoodPage] = useState(false);
  const [showServiceListing, setShowServiceListing] = useState(false);
  const [showJobListing, setShowJobListing] = useState(false);
  const [showRealEstate, setShowRealEstate] = useState(false);
  const [showFashion, setShowFashion] = useState(false);
  const [showVehiclePage, setShowVehiclePage] = useState(false);
  const [showGeneralMarketPage, setShowGeneralMarketPage] = useState(false);
  const [showCommunityPage, setShowCommunityPage] = useState(false);
  const [showStudioPage, setShowStudioPage] = useState(false);

  // Helper function to turn off all views
  const resetAllViews = () => {
    setShowMerch(false);
    setShowServices(false);
    setShowPrivacy(false);
    setShowBlog(false);
    setShowAllProjects(false);
    setShowMarket(false);
    setShowFoodPage(false);
    setShowServiceListing(false);
    setShowJobListing(false);
    setShowRealEstate(false);
    setShowFashion(false);
    setShowVehiclePage(false);
    setShowGeneralMarketPage(false);
    setShowCommunityPage(false);
    setShowStudioPage(false);
  };

  // Sync state with URL Hash
  const syncViewFromHash = () => {
    const hash = window.location.hash;
    
    // If hash is empty or a homepage section anchor, do nothing (stay on home)
    // unless we are currently showing a page, then we should reset.
    if (!hash || hash === '#home' || hash === '#about' || hash === '#ecosystem' || hash === '#vision' || hash === '#contact') {
      resetAllViews();
      return;
    }

    resetAllViews();
    
    switch (hash) {
      case '#store': setShowMerch(true); break;
      case '#solutions': setShowServices(true); break;
      case '#privacy': setShowPrivacy(true); break;
      case '#blog': setShowBlog(true); break;
      case '#projects': setShowAllProjects(true); break;
      case '#thanhloiquetoi': setShowMarket(true); break;
      case '#thanhloiquetoi-food': setShowFoodPage(true); break;
      case '#thanhloiquetoi-services': setShowServiceListing(true); break;
      case '#thanhloiquetoi-jobs': setShowJobListing(true); break;
      case '#thanhloiquetoi-real-estate': setShowRealEstate(true); break;
      case '#thanhloiquetoi-fashion': setShowFashion(true); break;
      case '#thanhloiquetoi-vehicles': setShowVehiclePage(true); break;
      case '#thanhloiquetoi-general': setShowGeneralMarketPage(true); break;
      case '#thanhloiquetoi-community': setShowCommunityPage(true); break;
      case '#thanhloiquetoi-studio': setShowStudioPage(true); break;
      default: break;
    }
  };

  // Setup listener for hash changes
  useEffect(() => {
    // Run on mount
    syncViewFromHash();

    // Run whenever the hash changes (e.g. user presses Back button)
    window.addEventListener('hashchange', syncViewFromHash);
    
    return () => {
      window.removeEventListener('hashchange', syncViewFromHash);
    };
  }, []);

  // Updated Handlers: Now they just update the Hash
  const handleOpenMerch = () => window.location.hash = 'store';
  const handleOpenServices = () => window.location.hash = 'solutions';
  const handleOpenPrivacy = () => window.location.hash = 'privacy';
  const handleOpenBlog = () => window.location.hash = 'blog';
  const handleOpenAllProjects = () => window.location.hash = 'projects';
  const handleOpenMarket = () => window.location.hash = 'thanhloiquetoi';
  const handleOpenFoodPage = () => window.location.hash = 'thanhloiquetoi-food';
  const handleOpenServiceListing = () => window.location.hash = 'thanhloiquetoi-services';
  const handleOpenJobListing = () => window.location.hash = 'thanhloiquetoi-jobs';
  const handleOpenRealEstate = () => window.location.hash = 'thanhloiquetoi-real-estate';
  const handleOpenFashion = () => window.location.hash = 'thanhloiquetoi-fashion';
  const handleOpenVehiclePage = () => window.location.hash = 'thanhloiquetoi-vehicles';
  const handleOpenGeneralMarketPage = () => window.location.hash = 'thanhloiquetoi-general';
  const handleOpenCommunityPage = () => window.location.hash = 'thanhloiquetoi-community';
  const handleOpenStudioPage = () => window.location.hash = 'thanhloiquetoi-studio';

  // Back Handlers
  const handleBackToHome = () => {
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    syncViewFromHash(); 
  };

  const handleBackToProjects = () => window.location.hash = 'projects';
  const handleBackToMarket = () => window.location.hash = 'thanhloiquetoi';

  if (showMerch) return <ProductShowcase onBack={handleBackToHome} />;
  if (showServices) return <ServicePage onBack={handleBackToHome} />;
  if (showPrivacy) return <PrivacyPolicy onBack={handleBackToHome} />;
  if (showBlog) return <BlogPage onBack={handleBackToHome} />;
  
  if (showFoodPage) return <FoodBeveragePage onBack={handleBackToMarket} />;
  if (showServiceListing) return <ServiceListingPage onBack={handleBackToMarket} />;
  if (showJobListing) return <JobListingPage onBack={handleBackToMarket} />;
  if (showRealEstate) return <RealEstatePage onBack={handleBackToMarket} />;
  if (showFashion) return <FashionPage onBack={handleBackToMarket} />;
  if (showVehiclePage) return <VehiclePage onBack={handleBackToMarket} />;
  if (showGeneralMarketPage) return <GeneralMarketPage onBack={handleBackToMarket} />;
  if (showCommunityPage) return <CommunityPage onBack={handleBackToMarket} />;
  if (showStudioPage) return <StudioPage onBack={handleBackToMarket} />;

  if (showMarket) {
    return <ThanhLoiMarketPage 
        onBack={handleBackToProjects} 
        onOpenFood={handleOpenFoodPage}
        onOpenServices={handleOpenServiceListing}
        onOpenJobs={handleOpenJobListing}
        onOpenRealEstate={handleOpenRealEstate}
        onOpenFashion={handleOpenFashion}
        onOpenVehicles={handleOpenVehiclePage}
        onOpenGeneralMarket={handleOpenGeneralMarketPage}
        onOpenCommunity={handleOpenCommunityPage}
        onOpenStudio={handleOpenStudioPage}
    />;
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

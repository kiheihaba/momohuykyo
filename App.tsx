
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
import FoodBeveragePage from './components/FoodBeveragePage';
import ServiceListingPage from './components/ServiceListingPage';
import JobListingPage from './components/JobListingPage';

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

  // Helper to handle view switching
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
  };

  const handleOpenMerch = () => {
    resetAllViews();
    setShowMerch(true);
  };

  const handleOpenServices = () => {
    resetAllViews();
    setShowServices(true);
  };

  const handleOpenPrivacy = () => {
    resetAllViews();
    setShowPrivacy(true);
  }

  const handleOpenBlog = () => {
    resetAllViews();
    setShowBlog(true);
  }

  const handleOpenAllProjects = () => {
    resetAllViews();
    setShowAllProjects(true);
  }

  const handleOpenMarket = () => {
    resetAllViews();
    setShowMarket(true);
  }

  const handleOpenFoodPage = () => {
    resetAllViews();
    setShowFoodPage(true);
  }

  const handleOpenServiceListing = () => {
    resetAllViews();
    setShowServiceListing(true);
  }

  const handleOpenJobListing = () => {
    resetAllViews();
    setShowJobListing(true);
  }

  const handleBackToHome = () => {
    resetAllViews();
  };

  // Navigations back
  const handleBackToProjects = () => {
    resetAllViews();
    setShowAllProjects(true);
  }

  const handleBackToMarket = () => {
    resetAllViews();
    setShowMarket(true);
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

  if (showFoodPage) {
    return <FoodBeveragePage onBack={handleBackToMarket} />;
  }

  if (showServiceListing) {
    return <ServiceListingPage onBack={handleBackToMarket} />;
  }

  if (showJobListing) {
    return <JobListingPage onBack={handleBackToMarket} />;
  }

  if (showMarket) {
    return <ThanhLoiMarketPage 
        onBack={handleBackToProjects} 
        onOpenFood={handleOpenFoodPage}
        onOpenServices={handleOpenServiceListing}
        onOpenJobs={handleOpenJobListing}
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

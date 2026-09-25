import TopBar from "../components/landing/TopBar";
import LandingHeader from "../components/landing/LandingHeader";
import Hero from "../components/landing/Hero";
import ServicesPreview from "../components/landing/ServicesPreview";
import DepartmentsSection from "../components/landing/DepartmentsSection";
import WorkflowSection from "../components/landing/WorkflowSection";
import Features from "../components/landing/Features";
import Statistics from "../components/landing/Statistics";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopBar />
      <LandingHeader />
      <main id="main-content" className="flex-1">
        <Hero />
        <ServicesPreview />
        <DepartmentsSection />
        <WorkflowSection />
        <Features />
        <Statistics />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
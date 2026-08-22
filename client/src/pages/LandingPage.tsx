import Hero from "../components/landing/Hero";
import ServicesPreview from "../components/landing/ServicesPreview";

import Features from "../components/landing/Features";
import WorkflowSection from "../components/landing/WorkflowSection";

import Statistics from "../components/landing/Statistics";
import Footer from "../components/landing/Footer";
const LandingPage = () => {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <Features />
      <WorkflowSection />
      <Statistics />
      <Footer />
    </>
  );
};

export default LandingPage;
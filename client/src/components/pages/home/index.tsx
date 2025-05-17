import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import FeaturesSection from "./FeaturesSection";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import Contact from "./Contact";
export const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <Pricing />
      <Contact />
    </div>
  );
};

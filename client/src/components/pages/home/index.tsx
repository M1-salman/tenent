import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";

export const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
};

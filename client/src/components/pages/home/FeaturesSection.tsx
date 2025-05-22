import { useRef, useState, useEffect } from "react";
import Feature from "./Feature";
import { motion, AnimatePresence } from "motion/react";
import Lottie from "lottie-react";

const lottieUrls = [
  // Modern, easy management/dashboard animation
  "https://assets2.lottiefiles.com/packages/lf20_49rdyysj.json", // dashboard/management
  "https://assets2.lottiefiles.com/packages/lf20_4kx2q32n.json", // monthly bill
];

const featuresData = [
  {
    heading: "Effortless tenant management",
    description:
      "Easily manage all your tenants in one place, with automatic tracking of total tenants and detailed information for each tenant.",
  },
  {
    heading: "Monthly Bill Management",
    description:
      "Easily generate and manage monthly rent bills for each tenant. Our system helps you easily calculate rent.",
  },
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lottieData, setLottieData] = useState<(object | null)[]>([null, null]);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    lottieUrls.forEach((url, i) => {
      if (!lottieData[i]) {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            setLottieData((prev) => {
              const copy = [...prev];
              copy[i] = data;
              return copy;
            });
          });
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = featureRefs.current.map((ref) =>
        ref ? ref.getBoundingClientRect().top : Infinity
      );
      const index = offsets.findIndex(
        (top) =>
          top > window.innerHeight * 0.2 && top < window.innerHeight * 0.8
      );
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
      } else if (index === -1) {
        // fallback: find the last visible
        const lastVisible = offsets.reduce(
          (acc, top, i) => (top < window.innerHeight * 0.8 ? i : acc),
          0
        );
        setActiveIndex(lastVisible);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % featuresData.length;
        setActiveIndex(nextIndex);
        featureRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + featuresData.length) % featuresData.length;
        setActiveIndex(prevIndex);
        featureRefs.current[prevIndex]?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <section 
      id="features" 
      className="w-full min-h-screen flex relative"
      ref={sectionRef}
      role="region"
      aria-label="Features"
      tabIndex={0}
    >
      {/* Left: Features stack */}
      <div 
        className="lg:w-1/2 w-full flex flex-col gap-32 lg:pl-32 pl-0 py-32"
        role="list"
        aria-label="Feature list"
      >
        {featuresData.map((feature, i) => (
          <div
            key={i}
            ref={(el) => {
              featureRefs.current[i] = el;
            }}
            style={{ minHeight: "80vh" }}
            role="listitem"
            aria-label={`Feature ${i + 1}: ${feature.heading}`}
            aria-selected={activeIndex === i}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveIndex(i);
                featureRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Feature
              heading={feature.heading}
              description={feature.description}
              rightContent={""}
            />
          </div>
        ))}
      </div>
      {/* Right: Fixed content with transition */}
      <div
        className="w-1/2 lg:flex hidden items-center justify-center"
        style={{ position: "sticky", top: 0, height: "120vh" }}
        role="complementary"
        aria-label={`Visualization for ${featuresData[activeIndex].heading}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center"
            role="img"
            aria-label={`Visualization for ${featuresData[activeIndex].heading}`}
            aria-live="polite"
          >
            {lottieData[activeIndex] ? (
              <Lottie
                animationData={lottieData[activeIndex]!}
                loop
                style={{ width: 350, height: 350 }}
                aria-hidden="true"
              />
            ) : (
              <div 
                className="w-[350px] h-[350px] bg-gray-200 animate-pulse rounded-xl"
                role="img"
                aria-label="Loading feature visualization"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
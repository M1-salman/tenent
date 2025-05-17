import { useState } from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section 
      className="flex flex-col items-center text-center mt-8 min-h-[calc(100vh-8rem)]"
      role="banner"
      aria-label="Hero section"
    >
      <div 
        className="font-black text-5xl md:text-7xl leading-tight text-black mb-10"
        role="heading"
        aria-level={1}
      >
        <span>Smarter renting,</span>
        <br />
        <span>simpler living</span>
      </div>
      <Link
        to="/signup"
        className={`px-12 py-4 rounded-full bg-[#b593ff] text-black font-semibold text-xl shadow-md transition-all duration-300 ${
          (isHovering || isFocused) ? 'scale-105' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        role="button"
        aria-label="Start your free trial with Tenent"
        tabIndex={0}
        style={{
          transform: (isHovering || isFocused) ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        Try Tenent for free
      </Link>
    </section>
  );
};

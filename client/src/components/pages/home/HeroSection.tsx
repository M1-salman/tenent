import { useState } from "react";

export const HeroSection = () => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <section className="flex flex-col items-center justify-center text-center mt-8">
      <div className="font-black text-5xl md:text-7xl leading-tight text-black mb-10">
        <span>Smarter renting,</span>
        <br />
        <span>simpler living</span>
      </div>
      <button
        className={`px-12 py-4 rounded-full bg-[#bca7ff] text-black font-semibold text-xl shadow-md transition-all duration-300 ${
          isHovering ? 'scale-105' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          transform: isHovering ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        Try Tenent for free
      </button>
    </section>
  );
};

import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { to: "/features", label: "Features" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full bg-white py-16">
      <nav className="mx-auto max-w-4xl flex items-center justify-between px-6 rounded-full shadow-none">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-3xl font-bold tracking-tight pb-2">
            Tenent
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-lg font-medium transition ${
                hoveredLink && hoveredLink !== link.to
                  ? "text-[#6e6e73]"
                  : "text-black"
              }`}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex">
          <Link
            to="/login"
            className="mr-4 text-lg font-medium ml-8"
          >
            Log in
          </Link>
          <div
            className={`transition-all duration-300 ${
              isHovering ? "scale-103" : "scale-100"
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              transform: isHovering ? "scale(1.05)" : "scale(1)",
              transition:
                "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <Link
              to="/signup"
              className={`ml-4 px-7 py-3.5 rounded-full bg-[#19171c] text-white font-semibold text-lg`}
            >
              Try for free
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

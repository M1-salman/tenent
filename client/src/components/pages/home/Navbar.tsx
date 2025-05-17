import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [focusedLink, setFocusedLink] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const navLinks = [
    { to: "#features", label: "Features" },
    { to: "#testimonials", label: "Testimonials" },
    { to: "#pricing", label: "Pricing" },
    { to: "#contact", label: "Contact" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    const element = document.querySelector(to);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, to: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Handle keyboard navigation between nav items
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!navRef.current) return;

      const navItems = Array.from(navRef.current.querySelectorAll('a[role="menuitem"]'));
      const currentIndex = navItems.findIndex(item => item === document.activeElement);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % navItems.length;
        (navItems[nextIndex] as HTMLElement).focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        (navItems[prevIndex] as HTMLElement).focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <header className="w-full bg-white py-16" role="banner">
      <nav 
        ref={navRef}
        className="mx-auto max-w-4xl flex items-center justify-between px-6 rounded-full shadow-none"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8" role="menubar">
          <Link 
            to="/" 
            className="text-3xl font-bold tracking-tight pb-2"
            role="menuitem"
            aria-label="Home"
            tabIndex={0}
          >
            Tenent
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleClick(e, link.to)}
              onKeyDown={(e) => handleKeyDown(e, link.to)}
              className={`text-md font-medium transition ${
                (hoveredLink === link.to || focusedLink === link.to)
                  ? "text-black"
                  : hoveredLink !== null
                  ? "text-[#6e6e73]"
                  : "text-black"
              }`}
              onMouseEnter={() => setHoveredLink(link.to)}
              onMouseLeave={() => setHoveredLink(null)}
              onFocus={() => setFocusedLink(link.to)}
              onBlur={() => setFocusedLink(null)}
              role="menuitem"
              aria-label={`Navigate to ${link.label} section`}
              tabIndex={0}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex" role="menubar">
          <Link
            to="/login"
            className="mr-4 text-md font-medium ml-8"
            role="menuitem"
            aria-label="Log in to your account"
            tabIndex={0}
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
              role="menuitem"
              aria-label="Sign up for a free trial"
              tabIndex={0}
            >
              Try for free
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

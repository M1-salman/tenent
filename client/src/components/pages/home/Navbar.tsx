import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [focusedLink, setFocusedLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, to: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const element = document.querySelector(to);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
      } else if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full bg-white lg:py-16 py-8" role="banner">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md"
      >
        Skip to main content
      </a>
      <nav 
        ref={navRef}
        className="mx-auto max-w-4xl flex items-center justify-between lg:px-6 px-4 rounded-full shadow-none"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="lg:text-3xl text-2xl font-bold tracking-tight pb-2"
            role="menuitem"
            aria-label="Home"
            tabIndex={0}
          >
            Tenent
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8" role="menubar">
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

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex" role="menubar">
          <Link
            to="/auth/login"
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
              to="/auth/register"
              className={`ml-4 px-7 py-3.5 rounded-full bg-[#19171c] text-white font-semibold text-lg`}
              role="menuitem"
              aria-label="Sign up for a free trial"
              tabIndex={0}
            >
              Try for free
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-black" />
          ) : (
            <Menu className="h-6 w-6 text-black" />
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
        )}

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="mobile-menu-title" className="text-xl font-semibold">
                Menu
              </h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 px-6 py-6">
              <div className="space-y-6">
                {/* Navigation Links */}
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={(e) => handleClick(e, link.to)}
                      onKeyDown={(e) => handleKeyDown(e, link.to)}
                      className="block text-lg font-medium text-black hover:text-gray-600 transition-colors py-2"
                      role="menuitem"
                      aria-label={`Navigate to ${link.label} section`}
                      tabIndex={0}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Auth Buttons */}
                <div className="space-y-4">
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-medium text-black hover:text-gray-600 transition-colors py-2"
                    role="menuitem"
                    aria-label="Log in to your account"
                    tabIndex={0}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 rounded-full bg-[#19171c] text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
                    role="menuitem"
                    aria-label="Sign up for a free trial"
                    tabIndex={0}
                  >
                    Try for free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
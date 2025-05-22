import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export const DashboardNav = () => {
  const navRef = useRef<HTMLElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${serverUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data.user?.image) {
          setProfileImage(data.user.image);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle keyboard navigation between nav items
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!navRef.current) return;

      const navItems = Array.from(
        navRef.current.querySelectorAll('a[role="menuitem"]')
      );
      const currentIndex = navItems.findIndex(
        (item) => item === document.activeElement
      );

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % navItems.length;
        (navItems[nextIndex] as HTMLElement).focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + navItems.length) % navItems.length;
        (navItems[prevIndex] as HTMLElement).focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
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
        </div>
        <div className="flex items-center gap-8">
          <div className="flex" role="menubar">
            <Link
              to="/dashboard"
              className="mr-4 text-md font-medium ml-8"
              role="menuitem"
              aria-label="Log in to your account"
              tabIndex={0}
            >
              Dashboard
            </Link>
          </div>
          <div>
            <Link
              to="/profile"
              className="block w-10 h-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              role="menuitem"
              aria-label="View and edit your profile"
              tabIndex={0}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Your profile picture"
                  className="w-full h-full object-cover"
                  aria-hidden="true"
                />
              ) : (
                <div 
                  className="w-full h-full bg-gray-100 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

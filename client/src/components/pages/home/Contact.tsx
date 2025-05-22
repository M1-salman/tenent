import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Contact() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contact"
      className="w-full min-h-screen bg-[#000000] text-white flex flex-col justify-between"
    >
      <div className="flex-1 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto w-full px-4 pt-16 pb-6 gap-12 md:gap-0">
        {/* Left: Logo and Socials */}
        <div className="flex flex-col items-center md:items-start gap-8 w-full md:w-1/2">
          <Link
            to="/"
            className="text-7xl font-bold tracking-tight pb-2 text-white"
          >
            Tenent
          </Link>
          <div className="flex gap-4 mb-2">
            <a
              href="https://x.com/salman_code"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b593ff] transition-colors text-2xl"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com/in/salman-masood917/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b593ff] transition-colors text-2xl"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/M1-salman/tenent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#b593ff] transition-colors text-2xl"
            >
              <FaGithub />
            </a>
          </div>
        </div>
        {/* Right: Newsletter */}
        <div className="flex-1 w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
            Check out my app and let me know what you think!
          </h2>
          <div className="mt-6 text-[#bdbdbd] text-sm text-center md:text-left">
            Email:{" "}
            <a
              href="mailto:salmanmasood917@gmail.com"
              className="underline hover:text-[#b593ff]"
            >
              salmanmasood917@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#2a2730] py-4 text-center text-[#bdbdbd] text-sm w-full">
        &copy; {year} salmanmasood917@gmail.com. All rights reserved.
      </div>
    </footer>
  );
}

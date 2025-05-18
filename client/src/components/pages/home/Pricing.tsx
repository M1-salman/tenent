import { useState } from "react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section id="pricing" className="w-full py-20 bg-[#f7f8fa]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
          Start managing your properties today
        </h2>
        
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Free</h3>
            <p className="text-[#6e6e73] text-lg">Perfect for getting started</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#b593ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Basic tenant management</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#b593ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Monthly rent calculation</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#b593ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Basic reporting</span>
            </div>
          </div>

          <div className="text-center">
            <div
              className={`inline-block transition-all duration-300 ${
                isHovering ? "scale-105" : "scale-100"
              }`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                transform: isHovering ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <Link
                to="/auth/register"
                className="inline-block px-8 py-4 rounded-full bg-[#b593ff] text-black font-semibold text-lg shadow-md"
              >
                Try for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

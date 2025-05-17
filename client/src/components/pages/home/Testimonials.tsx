import { useEffect, useRef } from 'react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Property Manager",
    image: "https://i.pravatar.cc/150?img=1",
    text: "Tenent has revolutionized how I manage my properties. The interface is intuitive and the automation features save me hours every week."
  },
  {
    name: "Michael Rodriguez",
    role: "Landlord",
    image: "https://i.pravatar.cc/150?img=2",
    text: "The tenant screening process is now a breeze. I can make informed decisions quickly and securely."
  },
  {
    name: "Emma Thompson",
    role: "Real Estate Investor",
    image: "https://i.pravatar.cc/150?img=3",
    text: "As someone managing multiple properties, Tenent has been a game-changer. The analytics and reporting features are invaluable."
  },
  {
    name: "David Kim",
    role: "Property Owner",
    image: "https://i.pravatar.cc/150?img=4",
    text: "The rent collection system is seamless. My tenants love the convenience, and I love the reliability."
  },
  {
    name: "Lisa Patel",
    role: "Property Developer",
    image: "https://i.pravatar.cc/150?img=5",
    text: "Tenent's maintenance request system has streamlined our operations. Response times have improved significantly."
  },
  {
    name: "James Wilson",
    role: "Real Estate Agent",
    image: "https://i.pravatar.cc/150?img=6",
    text: "The platform's integration with other tools makes it a perfect fit for our agency's workflow."
  },
  {
    name: "Maria Garcia",
    role: "Property Manager",
    image: "https://i.pravatar.cc/150?img=7",
    text: "The tenant portal is user-friendly and has reduced the number of support calls we receive."
  },
  {
    name: "Alex Wong",
    role: "Landlord",
    image: "https://i.pravatar.cc/150?img=8",
    text: "Tenent's automated reminders have helped us maintain a 99% on-time rent payment rate."
  },
  {
    name: "Sophie Anderson",
    role: "Property Owner",
    image: "https://i.pravatar.cc/150?img=9",
    text: "The financial reporting features give me clear insights into my property performance."
  },
  {
    name: "Ryan Murphy",
    role: "Real Estate Investor",
    image: "https://i.pravatar.cc/150?img=10",
    text: "Tenent has helped us scale our property management operations efficiently."
  }
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="w-full py-20 bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
          Loved by property managers worldwide
        </h2>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-hidden gap-8 pb-8 cursor-grab"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* First set of testimonials */}
          {testimonials.map((testimonial, index) => (
            <div
              key={`first-${index}`}
              className="flex-none w-[400px] bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-[#6e6e73]">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#19171c] leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
          
          {/* Duplicate set of testimonials for seamless loop */}
          {testimonials.map((testimonial, index) => (
            <div
              key={`second-${index}`}
              className="flex-none w-[400px] bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-[#6e6e73]">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-[#19171c] leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

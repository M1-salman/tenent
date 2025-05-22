interface FeaturesProps {
  heading: string;
  description: string;
  rightContent: string;
}

export default function Feature({
  heading,
  description,
  rightContent,
}: FeaturesProps) {
  return (
    <section className="rounded-3xl px-10 py-16">
      <div className="lg:w-1/2 w-full flex items-center justify-center lg:pl-32 px-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            {heading}
          </h2>
          <p className="text-lg md:text-md text-[#6e6e73] font-normal mb-2">
            {description}
          </p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        {rightContent}
      </div>
    </section>
  );
}

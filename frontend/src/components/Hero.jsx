import React from 'react';
import hero1 from "../assets/hero/hero-1.jpg"
// Assuming the JSON content is available as a static import or fetched via some method
import content from '../data/content.json';


// Sample content structure (replace with your actual import)

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                {content.hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#donate" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out text-center"
              >
                {content.hero.ctaText}
              </a>
              <a 
                href="#learn-more" 
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg font-semibold py-4 px-8 rounded-lg transition duration-300 ease-in-out text-center"
              >
                Learn More
              </a>
            </div>

            {/* Stats or Trust Indicators */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-gray-600">Years Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">200+</div>
                <div className="text-gray-600">Children Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">60+</div>
                <div className="text-gray-600">Volunteers</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-full blur-lg opacity-50"></div>
              <img 
                src={hero1}
                alt="Children playing and learning" 
                className="relative w-full h-auto rounded-2xl shadow-2xl object-cover transform hover:scale-[1.02] transition duration-500"
              />
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-200 rounded-full blur-lg opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
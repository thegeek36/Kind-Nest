import React from 'react';
import content from '../data/content.json';
import hero3 from "../assets/hero/hero-3.jpg"
import hero4 from "../assets/hero/hero-4.jpg"

// If you're importing content from a JSON file:

const About = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.about.title}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-2/3 space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              {content.about.description}
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                Learn More
              </button>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
                Contact Us
              </button>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="relative">
              <img 
                src={hero3}
                alt="Children reading" 
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-blue-600 opacity-10 hover:opacity-0 transition duration-300"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.about.stats.map((stat, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-5xl font-bold text-blue-600">{stat.number}</span>
                  <span className="text-lg text-gray-700 font-medium">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Image Section */}
        <div className="relative rounded-3xl overflow-hidden">
          <img 
            src={hero4}
            alt="Volunteers with children" 
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h4 className="text-2xl font-bold mb-2">Making a Difference</h4>
            <p className="text-lg opacity-90">Join us in creating positive change in our community</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
import React from 'react';
import { BookOpen, Heart, Utensils, Smile, Users ,GraduationCap } from 'lucide-react';
import content from '../data/content.json';

const IconMap = {
  "book-open": BookOpen,
  "heartbeat": Heart,
  "utensils": Utensils,
  "smile": Smile,
  "users": Users,
  "graduation-cap": GraduationCap
};
const WhatWeDo = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.whatWeDo.title}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <br></br>
          <p className="text-xl text-gray-700">
            {content.whatWeDo.description}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {content.whatWeDo.metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {metric.number}
                </div>
                <div className="text-gray-700 font-medium">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.whatWeDo.facilities.map((facility, index) => {
            const Icon = IconMap[facility.icon];
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {facility.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="#learn-more" 
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More About Our Programs
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
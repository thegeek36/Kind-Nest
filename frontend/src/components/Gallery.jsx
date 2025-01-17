import React, { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import content from '../data/content.json';
import hero1 from "../assets/hero/hero-1.jpg";
import hero2 from "../assets/hero/hero-2.jpg";
import hero3 from "../assets/hero/hero-3.jpg";
import hero4 from "../assets/hero/hero-4.jpg";
import hero5 from "../assets/hero/hero-5.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Array of images with their sources
  const galleryImages = [
    { id: 1, src: hero1, alt: "Group activity" },
    { id: 2, src: hero2, alt: "Children learning" },
    { id: 3, src: hero3, alt: "Sports day event" },
    { id: 4, src: hero4, alt: "Volunteer session" },
    { id: 5, src: hero5, alt: "Community gathering" }, // Reusing hero1 as example

  ];

  const handleNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSelectedImage(null);
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrevious();
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.gallery.title}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <br></br>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {content.gallery.description}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id}
              className={`relative group overflow-hidden rounded-2xl shadow-lg 
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                ${index === 3 ? 'md:col-span-2' : ''}
                aspect-[4/3]
              `}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                  >
                    <ZoomIn className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div 
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors duration-300"
                aria-label="Close lightbox"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-white text-lg mt-4 text-center">
                {selectedImage.alt}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
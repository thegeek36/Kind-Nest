import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import content from '../data/content.json';


const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {content.contact.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {content.contact.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-0"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Our Location</h4>
                    <p className="text-gray-600">{content.contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email Us</h4>
                    <a href={`mailto:${content.contact.email}`} className="text-blue-600 hover:underline">
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Call Us</h4>
                    <a href={`tel:${content.contact.phone}`} className="text-blue-600 hover:underline">
                      {content.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Follow Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {content.contact.socialMedia.map((social) => {
                  const Icon = socialIcons[social.icon.toLowerCase()];
                  return (
                    <a
                      key={social.platform}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition duration-300"
                    >
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span className="font-medium">{social.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Map or Additional Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Working Hours</h3>
              <div className="space-y-3 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact
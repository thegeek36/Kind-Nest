import React from 'react';
import { Heart, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <h3 className="text-xl font-semibold">Kind Nest Orphanage</h3>
            </div>
            <p className="text-slate-300">
              Nurturing hearts, building futures. Every child deserves a place to call home and a chance to dream big.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="/programs" className="text-slate-300 hover:text-white transition-colors">Our Programs</a>
              </li>
              <li>
                <a href="/volunteer" className="text-slate-300 hover:text-white transition-colors">Volunteer</a>
              </li>
              <li>
                <a href="/donate" className="text-slate-300 hover:text-white transition-colors">Support Us</a>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Subscribe to our newsletter"
                className="w-full px-3 py-2 bg-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="mt-2 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400">
          <p>© {new Date().getFullYear()} Kind Nest Orphanage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
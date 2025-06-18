import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import content from '../data/content.json';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { navigation } = content;

  const handleScroll = (path) => {
    if (path.startsWith('/')) {
      const sectionId = path.substring(1); // Remove leading "/"
      const section = document.getElementById(sectionId); // Find the section by ID
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section
      } else {
        console.warn(`No section found for ID: ${sectionId}`);
      }
    } else {
      // If the path is an external link, navigate normally
      window.location.href = path;
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const linkStyles = `text-lg px-4 py-2 transition-colors text-white hover:text-yellow-300`;

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            onClick={() => handleScroll('/')}
            className="text-3xl font-bold text-white cursor-pointer"
          >
            {navigation.logo}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.links.map((link) => (
              <button
                key={link.title}
                onClick={() => handleScroll(link.path)}
                className={linkStyles}
              >
                {link.title}
              </button>
            ))}
            
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors flex items-center gap-2"
              >
                Login
                <ChevronDown size={16} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="/staff-login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Staff Login
                  </a>
                  <a
                    href="/donor-login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Donors Login
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-yellow-300"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2">
            <ul className="divide-y divide-gray-200">
              {navigation.links.map((link) => (
                <li key={link.title}>
                  <button
                    onClick={() => handleScroll(link.path)}
                    className="block py-2 px-4 text-gray-800 hover:bg-blue-100"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="/staff-login"
                  className="block py-2 px-4 text-blue-600 font-medium hover:bg-blue-100"
                >
                  Staff Login
                </a>
              </li>
              <li>
                <a
                  href="/donors-login"
                  className="block py-2 px-4 text-blue-600 font-medium hover:bg-blue-100"
                >
                  Donors Login
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
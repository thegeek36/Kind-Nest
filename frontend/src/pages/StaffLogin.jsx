import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'staff', // Default selection
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(formData.email)) {
      console.log('Form submitted:', formData);
      // Add your login logic here
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 bg-opacity-95">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Kind Next Orphanage Management System
          </h1>
          <p className="text-gray-600 mt-2">Login to the portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select User Type</label>
            <div className="flex gap-4">
              {['admin', 'staff', 'volunteer'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(formData.email)) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();
        
        if (response.status === 201) {
          // Registration successful - show success message
          setSuccess('Registration successful! Redirecting to login page...');
          
          // Wait for 2 seconds before redirecting to login
          setTimeout(() => {
            navigate('/staff-login');
          }, 2000);
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError('An error occurred. Please try again later.');
        console.error('Registration error:', err);
      } finally {
        setLoading(false);
      }
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
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
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
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/staff-login" className="text-blue-600 hover:text-blue-700">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffRegister;
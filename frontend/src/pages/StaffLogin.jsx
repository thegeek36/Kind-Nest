import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Effect to redirect after showing success message
  useEffect(() => {
    let redirectTimer;
    if (successMessage) {
      redirectTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirect after 2 seconds
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [successMessage, navigate]);

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
        
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          
          // Set success message
          setSuccessMessage('Login successful! Redirecting to dashboard...');
          
          // Redirect will happen via useEffect after showing the message
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        setError('An error occurred. Please try again later.');
        console.error('Login error:', err);
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
          <p className="text-gray-600 mt-2">Login to the portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded transition-all duration-300 animate-pulse">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            disabled={loading || successMessage !== ''}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/staff-register" className="text-blue-600 hover:text-blue-700">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
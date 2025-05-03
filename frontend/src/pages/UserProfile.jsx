import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Clock, MapPin, Briefcase, Award } from 'lucide-react';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the JWT token from localStorage or your auth context
        const token = localStorage.getItem("token"); // Replace with actual token source
        
        const response = await fetch('http://127.0.0.1:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data = await response.json();
        
        // Enhance data with additional fields for UI display
        const enhancedData = {
          ...data,
          // Add these fields if they don't come from the API
          role: data.role || "User",
          lastLogin: data.last_login || "2025-05-01T15:30:00",
          location: data.location || "San Francisco, CA",
          department: data.department || "Engineering",
          memberSince: data.member_since || new Date(data.created_at).getFullYear().toString()
        };
        
        setUserData(enhancedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading user profile: {error}</p>
        <button className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded">
          Try Again
        </button>
      </div>
    );
  }

  // Format the created_at date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="bg-white p-2 rounded-full mb-4 md:mb-0 md:mr-6">
            <div className="bg-blue-100 rounded-full p-4">
              <User size={48} className="text-blue-600" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
            <p className="text-blue-100 flex items-center justify-center md:justify-start mt-1">
              <Shield size={16} className="mr-1" /> {userData.role}
            </p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-3">Basic Information</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{userData.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Member Since:</span>
                <span className="ml-2 font-medium">{userData.memberSince}</span>
              </div>
              <div className="flex items-center">
                <Shield className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium">{userData.role}</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-3">Additional Details</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Last Login:</span>
                <span className="ml-2 font-medium">{formatDate(userData.lastLogin)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium">{userData.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="text-blue-500 w-5 h-5 mr-2" />
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{userData.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center mb-2">
            <Award className="text-blue-500 mr-2" />
            <h2 className="font-semibold text-blue-700">Account Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium text-gray-800">#{userData.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registered On</p>
              <p className="font-medium text-gray-800">{formatDate(userData.created_at)}</p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition">
            Edit Profile
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
            Update Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
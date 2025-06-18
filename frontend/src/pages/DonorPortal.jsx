import React, { useState, useEffect } from 'react';
import { User, Heart, Package, BarChart3, LogOut, Plus, Eye, Filter, AlertTriangle, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000';

const DonorPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Donation form states
  const [donationType, setDonationType] = useState('Money');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationNotes, setDonationNotes] = useState('');
  const [donationItems, setDonationItems] = useState([{ item: '', quantity: '', category: '' }]);
  
  // Profile form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    password: ''
  });
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const categories = ["Food", "Education", "Clothing", "Medical", "Toys"];

  // API helper function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('donor_token');
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Request failed');
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || 'Network error');
  }
};

  // Load dashboard data
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const stats = await apiCall('/api/donors/dashboard-stats');
      setDashboardStats(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load donations
  const loadDonations = async (page = 1) => {
    setLoading(true);
    try {
      const data = await apiCall(`/api/donors/donations?page=${page}&per_page=10`);
      setDonations(data.donations);
      setCurrentPage(data.current_page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load specific donation
  const loadDonationDetails = async (id) => {
    setLoading(true);
    try {
      const donation = await apiCall(`/api/donors/donations/${id}`);
      setSelectedDonation(donation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load inventory
  const loadInventory = async (category = '') => {
    setLoading(true);
    try {
      const queryParam = category ? `?category=${category}` : '';
      const data = await apiCall(`/api/donors/inventory-items${queryParam}`);
      setInventory(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load critical items
  const loadCriticalItems = async () => {
    try {
      const data = await apiCall('/api/donors/critical-items');
      setCriticalItems(data.critical_items);
    } catch (err) {
      setError(err.message);
    }
  };

  // Load profile
  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/api/donors/profile');
      setProfile(data);
      setProfileForm({
        name: data.name,
        phone: data.phone,
        address: data.address,
        password: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Make donation
  const makeDonation = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let requestBody;
      
      if (donationType === 'Money') {
        requestBody = {
          donation_type: 'Money',
          amount: parseFloat(donationAmount),
          notes: donationNotes
        };
      } else {
        requestBody = {
          donation_type: 'Items',
          items: donationItems.filter(item => item.item && item.quantity && item.category),
          notes: donationNotes
        };
      }
      
      const response = await apiCall('/api/donors/donations', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
      
      setSuccess('Donation successful!');
      
      // Reset form
      setDonationAmount('');
      setDonationNotes('');
      setDonationItems([{ item: '', quantity: '', category: '' }]);
      
      // Reload dashboard if on dashboard tab
      if (activeTab === 'dashboard') {
        loadDashboard();
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiCall('/api/donors/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      
      setSuccess('Profile updated successfully!');
      setProfile(response.donor);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
const logout = async () => {
  try {
    localStorage.removeItem('donor_token'); // Remove token on logout
    window.location.href = '#'; // Redirect to hash route after logout
  } catch (err) {
    setError(err.message);
  }
};

  // Add donation item
  const addDonationItem = () => {
    setDonationItems([...donationItems, { item: '', quantity: '', category: '' }]);
  };

  // Remove donation item
  const removeDonationItem = (index) => {
    setDonationItems(donationItems.filter((_, i) => i !== index));
  };

  // Update donation item
  const updateDonationItem = (index, field, value) => {
    const newItems = [...donationItems];
    newItems[index][field] = value;
    setDonationItems(newItems);
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        loadDashboard();
        loadCriticalItems();
        break;
      case 'donations':
        loadDonations();
        break;
      case 'inventory':
        loadInventory(selectedCategory);
        loadCriticalItems();
        break;
      case 'profile':
        loadProfile();
        break;
    }
  }, [activeTab, selectedCategory]);

  // Sidebar component
  const Sidebar = () => (
    <div className="w-64 bg-blue-900 text-white h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Donor Portal
        </h1>
      </div>
      
      <nav className="mt-8">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'make-donation', label: 'Make A Donation', icon: Plus },
          { id: 'donations', label: 'Get Donations', icon: Eye },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'profile', label: 'Profile', icon: User },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-blue-800 transition-colors ${
                activeTab === item.id ? 'bg-blue-800 border-r-4 border-blue-300' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-red-800 transition-colors mt-8"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  );

  // Dashboard component
  const Dashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Donations</p>
                <p className="text-3xl font-bold">{dashboardStats.total_donations}</p>
              </div>
              <Heart className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Money Donated</p>
                <p className="text-3xl font-bold">${dashboardStats.total_money_donated}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Critical Items</p>
                <p className="text-3xl font-bold">{dashboardStats.critical_items_count}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200" />
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {dashboardStats?.recent_donations?.map(donation => (
              <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{donation.donation_type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {donation.amount && <p className="font-bold text-green-600">${donation.amount}</p>}
                  <p className="text-sm text-gray-500">{donation.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Critical Items Needed
          </h3>
          <div className="space-y-3">
            {criticalItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded border-l-4 border-red-500">
                <div>
                  <p className="font-medium">{item.item_name}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{item.quantity} {item.unit}</p>
                  <p className="text-sm text-gray-500">Need: {item.critical_level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Make Donation component
  const MakeDonation = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Make a Donation</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Type
            </label>
            <select
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Money">Money</option>
              <option value="Items">Items</option>
            </select>
          </div>
          
          {donationType === 'Money' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to Donate
              </label>
              {donationItems.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.item}
                    onChange={(e) => updateDonationItem(index, 'item', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateDonationItem(index, 'quantity', e.target.value)}
                    className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => updateDonationItem(index, 'category', e.target.value)}
                    className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {donationItems.length > 1 && (
                    <button
                      onClick={() => removeDonationItem(index)}
                      className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addDonationItem}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Another Item
              </button>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={donationNotes}
              onChange={(e) => setDonationNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any notes about your donation"
            />
          </div>
          
          <button
            onClick={makeDonation}
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Processing...' : 'Make Donation'}
          </button>
        </div>
      </div>
    </div>
  );

  // Donations List component
  const DonationsList = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Donations</h2>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="space-y-4">
            {donations.map(donation => (
              <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        donation.donation_type === 'Money' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.donation_type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(donation.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {donation.amount && (
                      <p className="text-2xl font-bold text-green-600 mb-2">
                        ${donation.amount}
                      </p>
                    )}
                    
                    {donation.donated_items && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {donation.donated_items.map((item, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {item.quantity} {item.item} ({item.category})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {donation.notes && (
                      <p className="text-sm text-gray-600 mb-2">{donation.notes}</p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 capitalize">{donation.status}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedDonationId(donation.id);
                      loadDonationDetails(donation.id);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Donation Details</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Donation ID</p>
                  <p className="text-lg">{selectedDonation.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <p className="text-lg">{selectedDonation.donation_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-lg">{new Date(selectedDonation.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-lg capitalize">{selectedDonation.status}</p>
                </div>
              </div>
              
              {selectedDonation.amount && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Amount</p>
                  <p className="text-2xl font-bold text-green-600">${selectedDonation.amount}</p>
                </div>
              )}
              
              {selectedDonation.donated_items && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Donated Items</p>
                  <div className="space-y-2">
                    {selectedDonation.donated_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.item}</span>
                        <span className="text-sm text-gray-600">
                          {item.quantity} - {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedDonation.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-gray-600">{selectedDonation.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Inventory component
  const Inventory = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Inventory</h2>
      
      <div className="flex gap-4 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {criticalItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Items Needed
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded border-l-4 border-red-500">
                <h4 className="font-medium">{item.item_name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm text-red-600 font-medium">
                  Current: {item.quantity} {item.unit} | Need: {item.critical_level}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">All Inventory Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div key={item.id} className={`p-4 rounded border-l-4 ${
                item.is_critical ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'
              }`}>
                <h4 className="font-medium">{item.item_name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className={`text-sm font-medium ${
                  item.is_critical ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.quantity} {item.unit}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                {item.is_critical && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    ⚠️ Below critical level ({item.critical_level})
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Profile component
  const Profile = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Read Only)
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={profileForm.address}
              onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={profileForm.password}
              onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter new password"
            />
          </div>
          
          <button
            onClick={updateProfile}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          
          {profile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}</p>
                <p><span className="font-medium">Account Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Error and Success Messages */}
          {/* {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )} */}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {/* Loading Spinner */}
          {loading && (
            <div className="mb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}
          
          {/* Content based on active tab */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'make-donation' && <MakeDonation />}
          {activeTab === 'donations' && <DonationsList />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default DonorPortal;
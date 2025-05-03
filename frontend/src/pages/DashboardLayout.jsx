import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './SideBar';
import Footer from '../components/Footer';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Placeholder data for when API fails
  const placeholderData = {
    welcome: "Welcome to Kind Nest Orphanage",
    kpis: {
      orphans: 127,
      volunteers: 48,
      donations_this_month: 12390,
      low_inventory_items: [
        { id: 1, item_name: "Rice", quantity: 5, unit: "kg" },
        { id: 2, item_name: "Milk", quantity: 3, unit: "liters" }
      ],
      past_events: 12,
      upcoming_events: 7
    },
    charts: {
      events_per_month: [
        { month: "Jan", events: 4 },
        { month: "Feb", events: 6 },
        { month: "Mar", events: 3 },
        { month: "Apr", events: 5 },
        { month: "May", events: 2 },
        { month: "Jun", events: 7 }
      ]
    }
  };

  // Sample data for the volunteers chart (keeping this from your original code)
  const volunteerData = [
    { name: 'Jan', volunteers: 24 },
    { name: 'Feb', volunteers: 13 },
    { name: 'Mar', volunteers: 18 },
    { name: 'Apr', volunteers: 39 },
    { name: 'May', volunteers: 48 },
    { name: 'Jun', volunteers: 38 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Replace with your actual JWT token
        const token = localStorage.getItem("token");
        
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/', {
          method: "GET",
         headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,  // ✅ Add token here
  },
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the events_per_month data to ensure it has month names
        if (data.charts && data.charts.events_per_month) {
          const monthNames = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 
            7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
          };
          
          data.charts.events_per_month = data.charts.events_per_month.map(item => ({
            ...item,
            month: monthNames[item.month] || `Month ${item.month}`
          }));
        }
        
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(`Failed to load dashboard data: ${err.message}`);
        // Use placeholder data when API fails
        setDashboardData(placeholderData);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data when we're on the dashboard page
    if (location.pathname === '/dashboard') {
      fetchDashboardData();
    }
  }, [location.pathname]);

  // This function renders the dashboard content when on the index page
  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const data = dashboardData || placeholderData;

    return (
      <>
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.welcome}</h1>
        <p className="text-gray-500 mb-6">Here's what's happening with the orphanage today.</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Children</h3>
            <p className="text-2xl font-bold text-gray-800">{data.kpis.orphans}</p>
            <p className="text-green-500 text-sm">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Active Volunteers</h3>
            <p className="text-2xl font-bold text-gray-800">{data.kpis.volunteers}</p>
            <p className="text-green-500 text-sm">↑ 8% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Monthly Donations</h3>
            <p className="text-2xl font-bold text-gray-800">${data.kpis.donations_this_month}</p>
            <p className="text-red-500 text-sm">↓ 3% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Upcoming Events</h3>
            <p className="text-2xl font-bold text-gray-800">{data.kpis.upcoming_events}</p>
            <p className="text-gray-500 text-sm">Past events: {data.kpis.past_events}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-800 font-semibold mb-4">Monthly Events Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.events_per_month}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-800 font-semibold mb-4">Volunteer Participation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volunteerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="volunteers" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Low Inventory Items */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-800 font-semibold mb-4">Low Inventory Items</h3>
          {data.kpis.low_inventory_items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.kpis.low_inventory_items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.item_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No low inventory items at the moment</p>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-800 font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p className="text-gray-600">New volunteer orientation completed - 12 new volunteers joined</p>
              <span className="ml-auto text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Monthly health checkup completed for all children</p>
              <span className="ml-auto text-gray-400">1d ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <p className="text-gray-600">Received major donation from ABC Corporation</p>
              <span className="ml-auto text-gray-400">2d ago</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-10 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
          <Sidebar />
        </div>

        {/* Mobile sidebar toggle */}
        <button 
          className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Main content area */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="p-8 overflow-auto">
            {/* Check if we're at the dashboard root path, if so render dashboard content directly */}
            {location.pathname === '/dashboard' ? (
              renderDashboardContent()
            ) : (
              /* Otherwise, render the child routes via Outlet */
              <Outlet />
            )}
          </div>
        </div>
      </div>

      {/* Footer with correct positioning */}
      <div className={`${sidebarOpen ? 'md:ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
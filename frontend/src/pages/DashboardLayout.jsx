import React from 'react';
import { 
  Home, 
  Users, 
  Package, 
  Heart, 
  UserPlus, 
  Calendar,
  LogOut
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from './SideBar';

const DashboardLayout = () => {
  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', donations: 4000, volunteers: 24 },
    { name: 'Feb', donations: 3000, volunteers: 13 },
    { name: 'Mar', donations: 2000, volunteers: 18 },
    { name: 'Apr', donations: 2780, volunteers: 39 },
    { name: 'May', donations: 1890, volunteers: 48 },
    { name: 'Jun', donations: 2390, volunteers: 38 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
     <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Children</h3>
              <p className="text-2xl font-bold text-gray-800">127</p>
              <p className="text-green-500 text-sm">↑ 12% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Active Volunteers</h3>
              <p className="text-2xl font-bold text-gray-800">48</p>
              <p className="text-green-500 text-sm">↑ 8% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Monthly Donations</h3>
              <p className="text-2xl font-bold text-gray-800">$12,390</p>
              <p className="text-red-500 text-sm">↓ 3% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Upcoming Events</h3>
              <p className="text-2xl font-bold text-gray-800">7</p>
              <p className="text-gray-500 text-sm">Next: Summer Camp</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-800 font-semibold mb-4">Monthly Donations Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-800 font-semibold mb-4">Volunteer Participation</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
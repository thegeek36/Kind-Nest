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
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/orphan-details', icon: Users, label: 'Orphan Details' },
    { path: '/inventory-details', icon: Package, label: 'Inventory Details' },
    { path: '/donors-list', icon: Heart, label: 'Donors Details' },
    { path: '/volunteer-details', icon: UserPlus, label: 'Volunteer Details' },
    { path: '/event-details', icon: Calendar, label: 'Event Details' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Kind Nest Portal</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`flex items-center px-4 py-3 cursor-pointer ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 w-full mt-4"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
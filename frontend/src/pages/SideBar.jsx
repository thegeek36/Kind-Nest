import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Heart, 
  Calendar, 
  DollarSign, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items with updated paths
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/dashboard/inventory' },
    { icon: <Users size={20} />, label: 'Orphan Details', path: '/dashboard/orphans' },
    { icon: <Heart size={20} />, label: 'Donors', path: '/dashboard/donors' },
    { icon: <Calendar size={20} />, label: 'Events', path: '/dashboard/events' },
    // { icon: <DollarSign size={20} />, label: 'Donations', path: '/dashboard/donations' },
    { icon: <Settings size={20} />, label: 'User', path: '/dashboard/userinfo' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust this if you're storing the token elsewhere
        },
      });

      if (response.ok) {
        // Clear JWT token or any other session data
        localStorage.removeItem('token'); // Adjust if you're storing the token elsewhere
        
        // Redirect to the home page
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-64 h-full bg-slate-900 text-white">
      <div className="p-4 flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-500" />
        <h2 className="text-lg font-semibold">Kind Nest Orphanage</h2>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-pink-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

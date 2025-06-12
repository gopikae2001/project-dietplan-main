
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Utensils, 
  ShoppingCart, 
  BarChart3,
  Search
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Food Item', path: '/food-items', icon: Utensils },
    { label: 'Diet Package Management', path: '/diet-plans', icon: FileText },
    { label: 'Diet Order Management', path: '/orders', icon: ShoppingCart },
    // { label: 'Patients', path: '/patients', icon: Users },
    // { label: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col" style={{ fontFamily: 'poppins', fontSize: '11px' }}>
      {/* Header with Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded overflow-hidden">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-blue-400">HODO</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search - Ctrl +"
            className="w-full bg-slate-800 border border-slate-600 rounded px-10 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 py-2">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-slate-800 ${
                  location.pathname === item.path
                    ? 'bg-slate-800 text-white border-r-2 border-blue-500'
                    : 'text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span className="text-slate-500">▶</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

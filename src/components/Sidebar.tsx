
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Triangle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Food Item', path: '/food-items' },
    { label: 'Diet Package Management', path: '/diet-plans' },
    { label: 'Diet Order Management', path: '/orders' },
    // { label: 'Patients', path: '/patients' },
    // { label: 'Reports', path: '/reports' },
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
                className={`group flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-900/30 text-blue-400 border-r-2 border-blue-500'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Triangle 
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${
                      location.pathname === item.path 
                        ? 'text-blue-400 scale-110' 
                        : 'text-slate-500 group-hover:text-blue-400 group-hover:scale-110'
                    } fill-current -rotate-90`} 
                  />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

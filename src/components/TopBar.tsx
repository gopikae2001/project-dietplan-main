
import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const TopBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? '#0d92ae' : 'white';
  };
  return (
    <div className="border-b border-bg-slate-900 px-6 py-3" style={{ backgroundColor: '#101010', fontFamily: 'Poppins', fontSize: '10px' }}>
      <div className="flex items-center justify-between">
        {/* Left side - Dashboard navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/" className={`text-base font-medium cursor-pointer hover:text-[#0d92ae]`} style={{ color: isActive('/') }}>
            Dashboard
          </Link>
          <Link to="/food-items" className={`text-base font-medium cursor-pointer hover:text-[#0d92ae]`} style={{ color: isActive('/food-items') }}>
            Add Food Item
          </Link>
          <Link to="/diet-plans" className={`text-base font-medium cursor-pointer hover:text-[#0d92ae]`} style={{ color: isActive('/diet-plans') }}>
            Diet Package
          </Link>
          <Link to="/orders" className={`text-base font-medium cursor-pointer hover:text-[#0d92ae]`} style={{ color: isActive('/orders') }}>
            Diet Order
          </Link>
        </div>
        
        {/* Center - Search bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Patients details"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-white hover:text-black hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 text-white hover:text-black hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="relative p-2 text-white hover:text-black hover:bg-gray-100 rounded-lg">
            <User className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">System Admin</p>
              <p className="text-xs text-white">System Admin</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">SA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

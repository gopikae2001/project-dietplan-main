
import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">View analytics and generate reports</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Reports and analytics features coming soon...</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;

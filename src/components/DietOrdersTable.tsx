
import React from 'react';
import { MoreHorizontal, Eye } from 'lucide-react';

const DietOrdersTable = () => {
  // Format current date as 'MMM DD, YYYY' (e.g., 'Jun 12, 2023')
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const orders = [
    {
      id: '001',
      patientName: 'Sajan Kumar',
      patientId: 'P001247',
      dietPlan: 'Diabetic Diet',
      status: 'Active',
      lastUpdated: '2 hours ago',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: '002',
      patientName: 'Shajeer Ahmed',
      patientId: 'P001248',
      dietPlan: 'Low Sodium',
      status: 'Pending',
      lastUpdated: '4 hours ago',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: '003',
      patientName: 'Danny Wilson',
      patientId: 'P001249',
      dietPlan: 'Heart Healthy',
      status: 'Completed',
      lastUpdated: '6 hours ago',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: '004',
      patientName: 'Ishan Patel',
      patientId: 'P001250',
      dietPlan: 'Renal Diet',
      status: 'Active',
      lastUpdated: '8 hours ago',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: '005',
      patientName: 'Vinodh Kumar',
      patientId: 'P001251',
      dietPlan: 'Weight Loss',
      status: 'Review',
      lastUpdated: '1 day ago',
      statusColor: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Diet Orders</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diet Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.patientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.patientId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.dietPlan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.lastUpdated}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 p-1 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietOrdersTable;


import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Utensils, ShoppingCart } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Index = () => {
  const [orders] = useLocalStorage('dietOrders', []);

  const monthlyData = [
    { month: 'Jan', orders: 45, revenue: 12000 },
    { month: 'Feb', orders: 52, revenue: 14000 },
    { month: 'Mar', orders: 48, revenue: 13500 },
    { month: 'Apr', orders: 61, revenue: 16000 },
    { month: 'May', orders: 55, revenue: 15200 },
    { month: 'Jun', orders: 67, revenue: 18000 }
  ];

  const dietTypeData = [
    { name: 'Regular', value: 45, color: '#0088FE' },
    { name: 'Diabetic', value: 30, color: '#00C49F' },
    { name: 'High Protein', value: 15, color: '#FFBB28' },
    { name: 'Cardiac', value: 10, color: '#FF8042' }
  ];

  const approvedOrders = orders.filter((order: any) => order.status === 'approved').length;
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.rate || 0), 0);

  const stats = [
    { title: 'Total Orders', value: orders.length.toString(), icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Approved Orders', value: approvedOrders.toString(), icon: Users, color: 'bg-green-500' },
    { title: 'Diet Plans', value: '89', icon: Utensils, color: 'bg-orange-500' },
    { title: 'Monthly Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: Calendar, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#d9e0e7', fontFamily: 'poppins', fontSize: '14px' }}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold" style={{ color: '#0d92ae' }}>Dashboard</h1>
            <p className="text-gray-800 mt-2">Welcome back! Here's what's happening at your hospital today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#0d92ae' }}>Monthly Orders & Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#0d92ae" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#0d92ae' }}>Diet Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dietTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dietTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold" style={{ color: '#0d92ae' }}>Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diet Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dietPlan}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.rate}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sajan</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Diabetic Diet</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹350</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Shajeer</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Regular Diet</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Approved</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹250</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

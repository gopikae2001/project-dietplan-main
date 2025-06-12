
import React from 'react';
import { Users, ShoppingCart, FileText, TrendingUp } from 'lucide-react';

const SummaryCards = () => {
  const cards = [
    {
      title: 'Total Patients',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: "Today's Orders",
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Active Diet Plans',
      value: '34',
      change: '+2%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Monthly Revenue',
      value: '₹45,280',
      change: '+18%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-[0_1px_3px_0px_rgba(0,0,0,0.8)] border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

import React from 'react';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import Sidebar from './SideBar';

const InventoryDetails = () => {
  const inventory = [
    { id: 1, item: 'Blankets', quantity: 150, category: 'Bedding', status: 'In Stock', lastUpdated: '2024-02-10', minRequired: 100 },
    { id: 2, item: 'Rice (kg)', quantity: 300, category: 'Food', status: 'Low Stock', lastUpdated: '2024-02-12', minRequired: 400 },
    { id: 3, item: 'School Books', quantity: 200, category: 'Education', status: 'In Stock', lastUpdated: '2024-02-08', minRequired: 150 },
    { id: 4, item: 'Medical Supplies', quantity: 50, category: 'Healthcare', status: 'Critical', lastUpdated: '2024-02-13', minRequired: 100 },
    { id: 5, item: 'Toys', quantity: 80, category: 'Recreation', status: 'In Stock', lastUpdated: '2024-02-09', minRequired: 50 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add New Item
            </button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm mb-2">Total Items</h3>
              <p className="text-2xl font-bold">780</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm mb-2">Low Stock Items</h3>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500 text-sm mb-2">Critical Stock Items</h3>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow">
            {/* Search Section */}
            <div className="p-4 border-b">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  className="ml-2 bg-transparent focus:outline-none flex-1"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.item}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.quantity}
                        {item.quantity < item.minRequired && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Update</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;

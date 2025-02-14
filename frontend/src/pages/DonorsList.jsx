import React from 'react';
import { Search, Plus } from 'lucide-react';
import Sidebar from './SideBar';

const DonorsList = () => {
  const donors = [
    { id: 1, name: 'Alice Johnson', donationAmount: 500, date: '2023-06-10', contact: 'alice@example.com' },
    { id: 2, name: 'Bob Williams', donationAmount: 300, date: '2023-07-15', contact: 'bob@example.com' },
    { id: 3, name: 'Catherine Lee', donationAmount: 1000, date: '2023-08-05', contact: 'catherine@example.com' },
    { id: 4, name: 'David Kim', donationAmount: 750, date: '2023-07-20', contact: 'david@example.com' },
    { id: 5, name: 'Emma Brown', donationAmount: 200, date: '2023-06-25', contact: 'emma@example.com' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Donors List</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Add New Donor
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors..."
                className="ml-2 bg-transparent focus:outline-none flex-1"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donation Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{donor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${donor.donationAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donor.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donor.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorsList;

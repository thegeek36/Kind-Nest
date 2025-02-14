import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Sidebar from './SideBar';

const OrphanDetails = () => {
  const [orphans, setOrphans] = useState([
    { id: 1, name: 'John Doe', age: 8, gender: 'Male', admissionDate: '2023-05-15', healthStatus: 'Good', education: '3rd Grade' },
    { id: 2, name: 'Jane Smith', age: 6, gender: 'Female', admissionDate: '2023-06-20', healthStatus: 'Good', education: '1st Grade' },
    { id: 3, name: 'Michael Brown', age: 10, gender: 'Male', admissionDate: '2023-04-10', healthStatus: 'Fair', education: '5th Grade' },
    { id: 4, name: 'Sarah Wilson', age: 7, gender: 'Female', admissionDate: '2023-07-30', healthStatus: 'Good', education: '2nd Grade' },
    { id: 5, name: 'David Lee', age: 9, gender: 'Male', admissionDate: '2023-03-25', healthStatus: 'Excellent', education: '4th Grade' },
  ]);
  const [searchText, setSearchText] = useState('');

  const filteredOrphans = orphans.filter((orphan) =>
    orphan.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Orphan Details</h1>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Add New Child
            </button>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow">
            {/* Search Section */}
            <div className="p-4 border-b">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search children..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="ml-2 bg-transparent focus:outline-none flex-1"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrphans.map((orphan) => (
                    <tr key={orphan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.admissionDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.healthStatus}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{orphan.education}</td>
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
    </div>
  );
};

export default OrphanDetails;

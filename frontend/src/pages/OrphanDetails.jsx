import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Eye, Save, AlertCircle } from 'lucide-react';
// import Sidebar from './SideBar';

const OrphanManagement = () => {
  const API_URL = 'http://127.0.0.1:5000/api';
  
  const [orphans, setOrphans] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedOrphan, setSelectedOrphan] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    background: '',
    health_status: 'Good',
    education_status: 'Primary School'
  });

  // Fetch orphans data on component mount
  useEffect(() => {
    fetchOrphans();
  }, []);

  const fetchOrphans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orphans/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrphans(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orphans:', err);
      setError('Failed to load orphans data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' ? parseInt(value) || '' : value });
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      background: '',
      health_status: 'Good',
      education_status: 'Primary School'
    });
    setModalType('add');
    setShowModal(true);
  };

  const openViewModal = (orphan) => {
    setSelectedOrphan(orphan);
    setModalType('view');
    setShowModal(true);
  };

  const openEditModal = (orphan) => {
    setSelectedOrphan(orphan);
    setFormData({
      name: orphan.name,
      age: orphan.age,
      gender: orphan.gender,
      background: orphan.background || '',
      health_status: orphan.health_status || 'Good',
      education_status: orphan.education_status || 'Primary School'
    });
    setModalType('edit');
    setShowModal(true);
  };

  const openDeleteModal = (orphan) => {
    setSelectedOrphan(orphan);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      let response;
      
      if (modalType === 'add') {
        response = await fetch(`${API_URL}/orphans/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      } else if (modalType === 'edit') {
        response = await fetch(`${API_URL}/orphans/${selectedOrphan.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      } else if (modalType === 'delete') {
        response = await fetch(`${API_URL}/orphans/${selectedOrphan.id}`, {
          method: 'DELETE'
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh orphans list and close modal
      await fetchOrphans();
      setShowModal(false);
      
    } catch (err) {
      console.error('Error processing request:', err);
      setError(`Failed to ${modalType} orphan data. Please try again.`);
    }
  };

  const filteredOrphans = orphans.filter((orphan) =>
    orphan.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Orphan Management</h1>
            <button 
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Child
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

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
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrphans.length > 0 ? (
                      filteredOrphans.map((orphan) => (
                        <tr key={orphan.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{orphan.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{orphan.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{orphan.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              orphan.health_status === 'Excellent' ? 'bg-green-100 text-green-800' : 
                              orphan.health_status === 'Good' ? 'bg-blue-100 text-blue-800' : 
                              orphan.health_status === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {orphan.health_status || 'Not Set'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{orphan.education_status || 'Not Set'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              onClick={() => openViewModal(orphan)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Eye className="h-5 w-5 inline" />
                            </button>
                            <button 
                              onClick={() => openEditModal(orphan)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="h-5 w-5 inline" />
                            </button>
                            <button 
                              onClick={() => openDeleteModal(orphan)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No orphans found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-medium text-gray-900">
                {modalType === 'add' && 'Add New Child'}
                {modalType === 'edit' && 'Edit Child Information'}
                {modalType === 'view' && 'Child Details'}
                {modalType === 'delete' && 'Confirm Deletion'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              {modalType === 'delete' ? (
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-lg mb-6">
                    Are you sure you want to delete {selectedOrphan.name}'s record? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : modalType === 'view' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-gray-900">{selectedOrphan.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-gray-900">{selectedOrphan.age}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="text-gray-900">{selectedOrphan.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Health Status</p>
                      <p className="text-gray-900">{selectedOrphan.health_status || 'Not Set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Education Status</p>
                      <p className="text-gray-900">{selectedOrphan.education_status || 'Not Set'}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Background</p>
                    <p className="text-gray-900">{selectedOrphan.background || 'No background information available.'}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age*
                      </label>
                      <input
                        type="number"
                        name="age"
                        min="0"
                        max="18"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender*
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Health Status
                      </label>
                      <select
                        name="health_status"
                        value={formData.health_status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education Status
                      </label>
                      <select
                        name="education_status"
                        value={formData.education_status}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="None">None</option>
                        <option value="Primary School">Primary School</option>
                        <option value="Middle School">Middle School</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background
                    </label>
                    <textarea
                      name="background"
                      value={formData.background}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                      <Save className="h-5 w-5 mr-1" />
                      {modalType === 'add' ? 'Add' : 'Update'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrphanManagement;
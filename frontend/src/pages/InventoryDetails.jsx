import React, { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle, X, RefreshCw, Archive, Clock } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:5000/api";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: 0,
    quantity_change: 0,
    remarks: ''
  });
  const [error, setError] = useState(null);

  // Categories for dropdown
  const categories = ['Shelter', 'Food', 'Healthcare', 'Education', 'Recreation', 'Clothing', 'Other'];

  // Fetch inventory on component mount
  useEffect(() => {
    fetchInventory();
    fetchLogs();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // In a real app with proper API integration:
      const response = await fetch(`${API_BASE_URL}/inventory/`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data. Please try again later.');
      
      // Fallback to mock data for demonstration
      const mockData = [
        { id: 1, item_name: 'Blankets', category: 'Shelter', quantity: 150 },
        { id: 2, item_name: 'Rice (kg)', category: 'Food', quantity: 300 },
        { id: 3, item_name: 'School Books', category: 'Education', quantity: 200 },
        { id: 4, item_name: 'Medical Supplies', category: 'Healthcare', quantity: 50 },
        { id: 5, item_name: 'Toys', category: 'Recreation', quantity: 80 },
      ];
      setInventory(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      // In a real app with proper API integration:
      const response = await fetch(`${API_BASE_URL}/inventory/logs`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      
      // Fallback to mock data for demonstration
      const mockLogs = [
        { item_name: 'Blankets', category: 'Shelter', action: 'Added', quantity: 150, quantity_changed: 150, remarks: 'Initial addition', timestamp: '2025-05-03T10:30:00' },
        { item_name: 'Rice (kg)', category: 'Food', action: 'Added', quantity: 300, quantity_changed: 300, remarks: 'Initial stock', timestamp: '2025-05-02T14:45:00' },
        { item_name: 'Blankets', category: 'Shelter', action: 'Deducted', quantity: 140, quantity_changed: -10, remarks: 'Distributed to volunteers', timestamp: '2025-05-03T11:15:00' },
      ];
      setLogs(mockLogs);
    }
  };

  const handleSubmitAdd = async () => {
    if (!formData.item_name || !formData.category || formData.quantity <= 0) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      // Real API call
      const response = await fetch(`${API_BASE_URL}/inventory/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: formData.item_name,
          category: formData.category,
          quantity: parseInt(formData.quantity)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }
      
      // Refresh inventory and logs after successful addition
      await fetchInventory();
      await fetchLogs();
      
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
      alert(error.message || 'Error adding item');
    }
  };

  const handleSubmitUpdate = async () => {
    if (!formData.quantity_change || !formData.remarks) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      const isDeduction = parseInt(formData.quantity_change) < 0;
      
      // API endpoint determination based on operation
      const endpoint = isDeduction 
        ? `${API_BASE_URL}/inventory/deduct` 
        : `${API_BASE_URL}/inventory/update`;
      
      const requestBody = isDeduction 
        ? {
            item: selectedItem.item_name,
            quantity: Math.abs(parseInt(formData.quantity_change)),
            remarks: formData.remarks
          }
        : {
            item_name: selectedItem.item_name,
            category: selectedItem.category,
            quantity_change: parseInt(formData.quantity_change)
          };
      
      const response = await fetch(endpoint, {
        method: isDeduction ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update inventory');
      }
      
      // Refresh inventory and logs after successful update
      await fetchInventory();
      await fetchLogs();
      
      setShowUpdateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating item:', error);
      alert(error.message || 'Error updating item');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/delete/${selectedItem.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
      
      // Refresh inventory and logs after successful deletion
      await fetchInventory();
      await fetchLogs();
      
      setShowDeleteModal(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(error.message || 'Error deleting item');
    }
  };

  const resetForm = () => {
    setFormData({
      item_name: '',
      category: '',
      quantity: 0,
      quantity_change: 0,
      remarks: ''
    });
    setSelectedItem(null);
  };

  const openUpdateModal = (item) => {
    setSelectedItem(item);
    setFormData({
      ...formData,
      item_name: item.item_name,
      category: item.category,
    });
    setShowUpdateModal(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const getStatusLabel = (quantity) => {
    if (quantity <= 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 20) return { text: 'Critical', color: 'bg-red-100 text-red-800' };
    if (quantity < 50) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredInventory = inventory.filter(item => 
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate dashboard stats
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < 50 && item.quantity > 20).length;
  const criticalStockItems = inventory.filter(item => item.quantity <= 20).length;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowLogs(!showLogs)} 
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Clock className="h-5 w-5 mr-2" />
            {showLogs ? 'Hide Logs' : 'View Logs'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm mb-2">Total Items</h3>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm mb-2">Low Stock Items</h3>
          <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm mb-2">Critical Stock Items</h3>
          <p className="text-2xl font-bold text-red-600">{criticalStockItems}</p>
        </div>
      </div>

      {/* Logs Section (Conditional) */}
      {showLogs && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Inventory Activity Logs</h2>
            <button onClick={() => setShowLogs(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <textarea 
              className="w-full h-60 p-4 font-mono text-sm bg-gray-50 border rounded-lg resize-none"
              readOnly
              value={logs.length > 0 ? 
                logs.map(log => 
                  `[${new Date(log.timestamp).toLocaleString()}] ${log.action}: ${Math.abs(log.quantity_changed)} ${log.item_name} (${log.category}) - ${log.remarks}`
                ).join('\n') : 
                'No activity logs available'
              }
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-700">
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
              placeholder="Search inventory..."
              className="ml-2 bg-transparent focus:outline-none flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const status = getStatusLabel(item.quantity);
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{item.item_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                          {item.quantity <= 20 && (
                            <AlertTriangle className="h-4 w-4 text-red-500 inline ml-2" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => openUpdateModal(item)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Update
                          </button>
                          <button 
                            onClick={() => openDeleteModal(item)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No items found. {searchTerm && "Try a different search term."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Add New Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.item_name}
                  onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Update {selectedItem.item_name}</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-700 font-medium">Current quantity: {selectedItem.quantity}</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity Change
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.quantity_change}
                    onChange={(e) => setFormData({...formData, quantity_change: e.target.value})}
                    placeholder="Enter negative value for deduction"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter positive value to add, negative value to deduct
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Remarks
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Reason for update"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-red-600">Delete Confirmation</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <Archive className="h-12 w-12 text-red-500 mr-4" />
                <div>
                  <p className="font-medium">Are you sure you want to delete this item?</p>
                  <p className="text-gray-600">{selectedItem.item_name} - {selectedItem.quantity} in stock</p>
                </div>
              </div>
              <p className="text-gray-500 mb-4">
                This action cannot be undone. This will permanently remove the item from the inventory.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
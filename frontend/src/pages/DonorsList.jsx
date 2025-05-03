import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    donor_name: '',
    age: '',
    donation_type: 'Money',
    amount: '',
    donated_items: []
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newItem, setNewItem] = useState({ item: '', quantity: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all donations on component mount
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/donations/');
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      const data = await response.json();
      setDonations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' || name === 'amount' ? Number(value) || '' : value });
  };

  const handleTypeChange = (e) => {
    const donationType = e.target.value;
    setFormData({
      ...formData,
      donation_type: donationType,
      // Reset relevant fields based on donation type
      amount: donationType === 'Money' ? formData.amount : '',
      donated_items: donationType === 'Things' ? formData.donated_items : []
    });
  };

  const handleAddItem = () => {
    if (newItem.item && newItem.quantity) {
      setFormData({
        ...formData,
        donated_items: [
          ...formData.donated_items,
          { 
            item: newItem.item, 
            quantity: Number(newItem.quantity) 
          }
        ]
      });
      setNewItem({ item: '', quantity: '' });
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.donated_items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, donated_items: updatedItems });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      let response;
      let method;
      let url = 'http://127.0.0.1:5000/api/donations/';
      
      // For update operations
      if (editMode) {
        method = 'PUT';
        url = `${url}${editId}`;
      } else {
        method = 'POST';
      }
      
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Operation failed with status: ${response.status}`);
      }
      
      setSuccessMessage(editMode ? 'Donation updated successfully!' : 'Donation added successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form and fetch updated donations
      resetForm();
      fetchDonations();
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (donation) => {
    setEditMode(true);
    setEditId(donation.id);
    
    const formDataToSet = {
      donor_name: donation.donor_name,
      age: donation.age || '',
      donation_type: donation.donation_type,
      amount: donation.amount || '',
      donated_items: donation.donated_items || []
    };
    
    setFormData(formDataToSet);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      donor_name: '',
      age: '',
      donation_type: 'Money',
      amount: '',
      donated_items: []
    });
    setNewItem({ item: '', quantity: '' });
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  const filteredDonations = donations.filter(donation => {
    return donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Donations Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          {showForm ? 'Cancel' : 'Add New Donation'}
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setShowSuccess(false)} className="text-green-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>Error: {error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Donation Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Donation' : 'Add New Donation'}</h2>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Donor Name</label>
                  <input
                    type="text"
                    name="donor_name"
                    value={formData.donor_name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Donation Type</label>
                <select
                  name="donation_type"
                  value={formData.donation_type}
                  onChange={handleTypeChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Money">Money</option>
                  <option value="Things">Things</option>
                </select>
              </div>

              {formData.donation_type === 'Money' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {formData.donation_type === 'Things' && (
                <div className="mb-6">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium">Donated Items</h3>
                  </div>

                  {/* Add new item form */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={newItem.item}
                        onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
                    >
                      Add
                    </button>
                  </div>

                  {/* List of added items */}
                  {formData.donated_items.length > 0 ? (
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <ul className="divide-y">
                        {formData.donated_items.map((item, index) => (
                          <li key={index} className="py-2 flex justify-between items-center">
                            <span>
                              {item.item} - {item.quantity} units
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No items added yet</div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {editMode ? 'Update Donation' : 'Submit Donation'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent focus:outline-none flex-1"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No donations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{donation.donor_name}</div>
                      {donation.age && <div className="text-sm text-gray-500">Age: {donation.age}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${
                        donation.donation_type === 'Money' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {donation.donation_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {donation.donation_type === 'Money' ? (
                        <div>Amount: ${donation.amount}</div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium">Items:</div>
                          <ul className="list-disc list-inside text-sm">
                            {donation.donated_items?.map((item, index) => (
                              <li key={index}>{item.item} (Qty: {item.quantity})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(donation)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
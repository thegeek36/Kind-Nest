import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2, X, Check, ChevronDown, ChevronUp, AlertTriangle, Search, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest first) or 'asc' (oldest first)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    participants: '',
    location: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/events/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Error fetching events. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Event name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (formData.participants && isNaN(parseInt(formData.participants))) {
      errors.participants = 'Participants must be a number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      participants: '',
      location: ''
    });
    setFormErrors({});
  };

  // Open add form
  const openAddForm = () => {
    resetForm();
    setFormMode('add');
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (event) => {
    setFormData({
      name: event.name,
      description: event.description,
      date: formatDateForInput(event.date),
      participants: event.participants ? event.participants.toString() : '',
      location: event.location
    });
    setSelectedEvent(event);
    setFormMode('edit');
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Add new event
  const addEvent = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          participants: formData.participants ? parseInt(formData.participants) : 0,
          location: formData.location
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to add event: ${response.status}`);
      }
      
      setRefreshKey(prev => prev + 1); // Trigger refetch
      closeForm();
    } catch (err) {
      setError('Error adding event: ' + (err.message || 'Please try again.'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          participants: formData.participants ? parseInt(formData.participants) : 0,
          location: formData.location
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update event: ${response.status}`);
      }
      
      setRefreshKey(prev => prev + 1); // Trigger refetch
      closeForm();
    } catch (err) {
      setError('Error updating event: ' + (err.message || 'Please try again.'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete event: ${response.status}`);
      }
      
      setRefreshKey(prev => prev + 1); // Trigger refetch
    } catch (err) {
      setError('Error deleting event: ' + (err.message || 'Please try again.'));
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get event details
  const getEventDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch event details: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      return null;
    }
  };

  // Toggle expanded event
  const toggleEventExpansion = async (id) => {
    if (expandedEvent === id) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(id);
      // Optionally fetch more details if needed
      // const details = await getEventDetails(id);
      // if (details) {
      //   setEvents(events.map(e => e.id === id ? details : e));
      // }
    }
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort events by date
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  // Refresh data
  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h1>
          <p className="text-gray-600">Organize and manage your upcoming events</p>
        </header>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {sortOrder === 'desc' ? 'Upcoming Events' : 'Past Events'}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleSortOrder}
                className="px-3 py-2 border border-gray-300 bg-white rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                title={sortOrder === 'desc' ? 'Sort by oldest first' : 'Sort by newest first'}
              >
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
              
              <button 
                onClick={refreshData}
                className="p-2 border border-gray-300 bg-white rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={18} />
              </button>
              
              <button 
                onClick={openAddForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus size={18} className="mr-1" /> Add Event
              </button>
            </div>
          </div>
        </div>
        
        {loading && !showForm ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedEvents.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                {searchTerm ? (
                  <p className="text-gray-500">No events match your search. Try different keywords or clear the search.</p>
                ) : (
                  <div>
                    <p className="text-gray-500 mb-4">No events found. Create your first event!</p>
                    <button 
                      onClick={openAddForm}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto transition-colors"
                    >
                      <Plus size={18} className="mr-1" /> Add New Event
                    </button>
                  </div>
                )}
              </div>
            ) : (
              sortedEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div 
                    className={`p-5 cursor-pointer ${
                      expandedEvent === event.id ? 'border-b border-gray-200' : ''
                    }`}
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.name}</h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar size={16} className="mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(event);
                          }} 
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-full mr-1"
                          title="Edit event"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id);
                          }}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-full"
                          title="Delete event"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="ml-2">
                          {expandedEvent === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {expandedEvent === event.id && (
                    <div className="p-5 bg-gray-50">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                          <div className="flex items-center text-gray-700">
                            <Clock size={16} className="mr-2" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Participants</h4>
                          <div className="flex items-center text-gray-700">
                            <Users size={16} className="mr-2" />
                            <span>{event.participants || "Not specified"}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                          <div className="flex items-center text-gray-700">
                            <MapPin size={16} className="mr-2" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center bg-gray-50 px-5 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {formMode === 'add' ? 'Add New Event' : 'Edit Event'}
                </h3>
                <button 
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="Event Name"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="Event Description"
                  ></textarea>
                  {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="date">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                  />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="location">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.location ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="Event Location"
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="participants">
                    Expected Participants
                  </label>
                  <input
                    type="number"
                    id="participants"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.participants ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    placeholder="Number of participants"
                    min="0"
                  />
                  {formErrors.participants && <p className="text-red-500 text-xs mt-1">{formErrors.participants}</p>}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={formMode === 'add' ? addEvent : updateEvent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-1" />
                        {formMode === 'add' ? 'Add Event' : 'Update Event'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
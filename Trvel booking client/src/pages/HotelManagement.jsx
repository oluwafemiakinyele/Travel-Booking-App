import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axios';

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Hotels');
      setHotels(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load hotel properties catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingHotel(null);
    reset({
      name: '',
      city: '',
      address: '',
      description: '',
      pricePerNight: '',
      availableRooms: '',
      rating: 4.5
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hotel) => {
    setEditingHotel(hotel);
    reset({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address || '',
      description: hotel.description || '',
      pricePerNight: hotel.pricePerNight,
      availableRooms: hotel.availableRooms,
      rating: hotel.rating || 4.5
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      setFormLoading(true);
      setSubmitError(null);

      const payload = {
        ...data,
        pricePerNight: Number(data.pricePerNight),
        availableRooms: Number(data.availableRooms),
        rating: Number(data.rating),
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80"]
      };

      if (editingHotel) {
        const response = await axiosInstance.put(`/Hotels/${editingHotel.id}`, payload);
        setHotels(hotels.map(h => h.id === editingHotel.id ? response.data : h));
        alert('Hotel property updated successfully.');
      } else {
        const response = await axiosInstance.post('/Hotels', payload);
        setHotels([response.data, ...hotels]);
        alert('Hotel property created successfully.');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel property? This will delete all active slots.')) return;
    try {
      await axiosInstance.delete(`/Hotels/${id}`);
      setHotels(hotels.filter(h => h.id !== id));
      alert('Hotel property deleted successfully.');
    } catch (err) {
      alert('Failed to delete hotel: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-6 text-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">Hotel Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage luxury resorts, bookings capacities, and night pricing.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={fetchHotels}
            className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-355 rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/15 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_home</span>
            Add Hotel
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2 py-0.5 rounded">PROPERTIES</span>
          <p className="text-2xl font-bold text-white mt-3">{hotels.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2 py-0.5 rounded">TOTAL ROOMS</span>
          <p className="text-2xl font-bold text-white mt-3">
            {hotels.reduce((acc, h) => acc + (h.availableRooms || 0), 0)}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-850 px-2 py-0.5 rounded">AVG PRICE</span>
          <p className="text-2xl font-bold text-white mt-3">
            ₦{(hotels.length > 0 ? Math.round(hotels.reduce((acc, h) => acc + (h.pricePerNight || 0), 0) / hotels.length) : 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading active properties database...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-sm">
            <p className="font-bold">{error}</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No properties found in DB. Click "Add Hotel" to list a new lodging spot.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">City / Address</th>
                  <th className="px-6 py-4 text-center">Rooms</th>
                  <th className="px-6 py-4">Price / Night</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-200">{h.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{h.description || 'No description provided.'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-350">
                      <p className="font-semibold">{h.city}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{h.address || 'No street address'}</p>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-300">
                      {h.availableRooms} rooms
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₦{Number(h.pricePerNight).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-accent-yellow">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="font-bold text-xs">{h.rating || 4.5}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(h)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-305 rounded-lg text-xs font-semibold border border-slate-700/60 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(h.id)}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/20 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-['Montserrat'] font-bold text-lg text-slate-100">
                {editingHotel ? 'Edit Hotel Details' : 'Create Hotel Property'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white material-symbols-outlined cursor-pointer"
              >
                close
              </button>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Hotel Name</label>
                  <input 
                    type="text" 
                    required 
                    {...register('name')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. The Ritz-Carlton"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">City Location</label>
                  <input 
                    type="text" 
                    required 
                    {...register('city')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. New York"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Street Address</label>
                <input 
                  type="text" 
                  required 
                  {...register('address')}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                  placeholder="e.g. Fifth Avenue, Central Park South"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Price / Night (₦)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    {...register('pricePerNight')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium text-center"
                    placeholder="450"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Total Rooms</label>
                  <input 
                    type="number" 
                    required 
                    {...register('availableRooms')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium text-center"
                    placeholder="50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Star Rating</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    required 
                    {...register('rating')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium text-center"
                    placeholder="4.8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Description Details</label>
                <textarea 
                  rows="3"
                  required
                  {...register('description')}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium resize-none"
                  placeholder="Tell customers about premium suites, room views, amenities, and pool features..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-800 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="flex-1 py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Save Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axios';

export default function FlightManagement() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Flights');
      setFlights(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load flights list.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingFlight(null);
    reset({
      flightNumber: '',
      airline: '',
      departureCity: '',
      arrivalCity: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      availableSeats: '',
      status: 'Scheduled'
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (flight) => {
    setEditingFlight(flight);
    // Format dates to fit HTML input[type="datetime-local"] format: YYYY-MM-DDThh:mm
    const depTime = flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '';
    const arrTime = flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '';

    reset({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departureCity: flight.departureCity,
      arrivalCity: flight.arrivalCity,
      departureTime: depTime,
      arrivalTime: arrTime,
      price: flight.price,
      availableSeats: flight.availableSeats,
      status: flight.status || 'Scheduled'
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
        price: Number(data.price),
        availableSeats: Number(data.availableSeats),
        departureTime: new Date(data.departureTime).toISOString(),
        arrivalTime: new Date(data.arrivalTime).toISOString()
      };

      if (editingFlight) {
        // Update flight
        const response = await axiosInstance.put(`/Flights/${editingFlight.id}`, payload);
        setFlights(flights.map(f => f.id === editingFlight.id ? response.data : f));
        alert('Flight updated successfully.');
      } else {
        // Create flight
        const response = await axiosInstance.post('/Flights', payload);
        setFlights([response.data, ...flights]);
        alert('Flight created successfully.');
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
    if (!window.confirm('Are you sure you want to delete this flight? This action cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/Flights/${id}`);
      setFlights(flights.filter(f => f.id !== id));
      alert('Flight deleted successfully.');
    } catch (err) {
      alert('Failed to delete flight: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-6 text-slate-100">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">Flight Management</h2>
          <p className="text-xs text-slate-500 mt-1">Add, update, and manage global premium airline flight slots.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={fetchFlights}
            className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/15 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Flight
          </button>
        </div>
      </header>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading active flights catalog...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-sm">
            <p className="font-bold">{error}</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No active flights. Click "Add Flight" to create a new slot.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Airline / Number</th>
                  <th className="px-6 py-4">From → To</th>
                  <th className="px-6 py-4">Departure & Arrival</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {flights.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-200">{f.airline}</p>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">{f.flightNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-350">
                      <span className="font-semibold">{f.departureCity}</span>
                      <span className="text-slate-500 mx-2">➔</span>
                      <span className="font-semibold">{f.arrivalCity}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>Dep: {new Date(f.departureTime).toLocaleString()}</div>
                      <div className="mt-1">Arr: {new Date(f.arrivalTime).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₦{Number(f.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {f.availableSeats} seats
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        f.status === 'Scheduled'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {f.status || 'Scheduled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(f)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700/60 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(f.id)}
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

      {/* Add / Edit Flight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-['Montserrat'] font-bold text-lg text-slate-100">
                {editingFlight ? 'Edit Flight Details' : 'Create Flight Slot'}
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Airline Name</label>
                  <input 
                    type="text" 
                    required 
                    {...register('airline')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. British Airways"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Flight Number</label>
                  <input 
                    type="text" 
                    required 
                    {...register('flightNumber')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. BA-421"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Departure City</label>
                  <input 
                    type="text" 
                    required 
                    {...register('departureCity')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. London"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Arrival City</label>
                  <input 
                    type="text" 
                    required 
                    {...register('arrivalCity')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium"
                    placeholder="e.g. New York"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Departure Time</label>
                  <input 
                    type="datetime-local" 
                    required 
                    {...register('departureTime')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Arrival Time</label>
                  <input 
                    type="datetime-local" 
                    required 
                    {...register('arrivalTime')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₦)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    {...register('price')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium text-center"
                    placeholder="1200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Seats</label>
                  <input 
                    type="number" 
                    required 
                    {...register('availableSeats')}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary font-medium text-center"
                    placeholder="150"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <select 
                    {...register('status')}
                    className="w-full bg-slate-950 border border-slate-850 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
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
                  {formLoading ? 'Saving...' : 'Save Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

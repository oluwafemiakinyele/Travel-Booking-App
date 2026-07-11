import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ManageHotelsAdminConsole() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState(150);
  const [availableRooms, setAvailableRooms] = useState(10);
  const [rating, setRating] = useState(4.5);
  const [category, setCategory] = useState('Luxury Resort');

  useEffect(() => {
    // Check if already logged in as Admin
    const user = api.auth.getCurrentUser();
    const token = api.auth.getToken();
    if (user && token) {
      setIsAdmin(true);
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await api.hotels.search();
      setHotels(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels from backend API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthError(null);
      await api.auth.login(email, password);
      setIsAdmin(true);
      fetchHotels();
    } catch (err) {
      setAuthError(err.message || 'Login failed. Note: Default admin credentials are admin@travelbooking.com / Admin@123');
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setIsAdmin(false);
    setHotels([]);
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setCity('');
    setDescription('');
    setPricePerNight(150);
    setAvailableRooms(10);
    setRating(4.5);
    setCategory('Luxury Resort');
    setIsModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setEditingId(hotel.id);
    setName(hotel.name);
    setCity(hotel.city);
    setDescription(hotel.description || '');
    setPricePerNight(hotel.pricePerNight);
    setAvailableRooms(hotel.availableRooms);
    setRating(hotel.rating || 4.5);
    setCategory(hotel.category || 'Luxury Resort');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel property?')) return;
    try {
      await api.hotels.delete(id);
      setHotels(hotels.filter(h => h.id !== id));
    } catch (err) {
      alert('Failed to delete hotel: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      city,
      description,
      pricePerNight: Number(pricePerNight),
      availableRooms: Number(availableRooms),
      rating: Number(rating),
      images: ["https://example.com/placeholder.jpg"]
    };

    try {
      if (editingId) {
        const updated = await api.hotels.update(editingId, payload);
        setHotels(hotels.map(h => h.id === editingId ? updated : h));
      } else {
        const created = await api.hotels.create(payload);
        setHotels([...hotels, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to save property: ' + err.message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-['Inter']">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-['Montserrat'] text-2xl font-bold text-primary mb-2">VoyagePremium</h1>
            <p className="text-sm text-slate-400">Admin Accommodations Console</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-xl p-3 leading-relaxed">
                {authError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@travelbooking.com"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95 mt-2 cursor-pointer"
            >
              Sign In to Console
            </button>
          </form>
          
          <div className="text-center mt-6 text-[11px] text-slate-500 leading-normal border-t border-slate-800/60 pt-4">
            <p className="font-semibold text-slate-400 mb-1">Seeded Credentials:</p>
            <p>Email: <code className="bg-slate-950 px-1 py-0.5 rounded text-primary">admin@travelbooking.com</code></p>
            <p className="mt-0.5">Password: <code className="bg-slate-950 px-1 py-0.5 rounded text-primary">Admin@123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Inter'] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-4 shrink-0">
        <div className="mb-8 px-2">
          <h1 className="font-['Montserrat'] font-bold text-xl text-primary">VoyagePremium</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <button className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all w-full text-left cursor-pointer">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl font-bold transition-all w-full text-left shadow-md shadow-primary/10 cursor-pointer">
            <span className="material-symbols-outlined text-lg">domain</span>
            <span className="font-medium text-sm">Hotels</span>
          </button>
        </div>
        
        <div className="mt-auto border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow">
              SA
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-500">Console Operator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-slate-800 hover:bg-red-900/20 hover:text-red-400 py-3 rounded-xl text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-['Montserrat'] font-bold text-2xl text-white">Hotel Management</h2>
            <p className="text-sm text-slate-400 mt-1">Oversee your global portfolio of premium accommodations.</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary hover:bg-primary-container text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Hotel
          </button>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">apartment</span>
              <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded">TOTAL UNITS</span>
            </div>
            <p className="text-2xl font-bold text-white">{hotels.length}</p>
            <p className="text-[10px] text-slate-500 mt-1">Live properties in DB</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
              <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded">MTD REVENUE</span>
            </div>
            <p className="text-2xl font-bold text-white">₦2.4M</p>
            <p className="text-[10px] text-slate-500 mt-1">Mock yield indicator</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">star</span>
              <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded">AVG RATING</span>
            </div>
            <p className="text-2xl font-bold text-white">4.8</p>
            <p className="text-[10px] text-slate-500 mt-1">Customer satisfaction index</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary text-xl">person_check</span>
              <span className="text-[10px] font-bold text-accent-yellow bg-accent-yellow/10 px-2 py-0.5 rounded">OCCUPANCY</span>
            </div>
            <p className="text-2xl font-bold text-white">92%</p>
            <p className="text-[10px] text-slate-500 mt-1">Peak seasonal index</p>
          </div>
        </div>

        {/* Data Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-semibold text-white text-base">All Properties</h3>
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading properties from PostgreSQL...
              </div>
            ) : hotels.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                No hotels found in the database. Click "Add Hotel" to create the first listing.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Hotel Details</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Rooms</th>
                    <th className="px-6 py-4">Price / Night</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-slate-800/40 transition-colors text-sm">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{hotel.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{hotel.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <span className="material-symbols-outlined text-sm text-slate-500">location_on</span>
                          {hotel.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-300">
                        {hotel.availableRooms}
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">
                        ₦{Number(hotel.pricePerNight).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-accent-yellow">
                          <span className="material-symbols-outlined text-sm">star</span>
                          {hotel.rating || 4.5}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(hotel)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(hotel.id)}
                            className="p-2 hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Add / Edit Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl relative z-10 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-['Montserrat'] font-bold text-lg">
                  {editingId ? 'Edit Accommodation' : 'Add New Hotel Property'}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {editingId ? 'Modify property parameters' : 'Enter the details for the new luxury listing'}
                </p>
              </div>
              <button
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Hotel Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Grand Horizon Resort"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Santorini"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Price / Night (₦)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pricePerNight}
                    onChange={e => setPricePerNight(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Available Rooms</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={availableRooms}
                    onChange={e => setAvailableRooms(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    required
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                >
                  <option>Luxury Resort</option>
                  <option>Boutique Hotel</option>
                  <option>Urban Business</option>
                  <option>Mountain Chalet</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe properties, amenities, and attractions..."
                  rows="3"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-primary transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-800 rounded-xl text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-container rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-primary/10 cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Save Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

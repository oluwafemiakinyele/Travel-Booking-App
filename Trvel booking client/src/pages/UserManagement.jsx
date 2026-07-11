import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve system users.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Customer' : 'Admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      setUpdatingUserId(userId);
      await axiosInstance.put(`/Admin/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`User role updated to ${newRole} successfully.`);
    } catch (err) {
      alert('Failed to update user role: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filter users based on query and selected role
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = u.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query) || u.phoneNumber?.includes(query);
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full font-['Inter'] space-y-6 text-slate-100">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-['Montserrat'] font-bold text-2xl text-slate-100">User Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage system user roles, access control, and user details.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl transition-all flex items-center justify-center cursor-pointer align-self-end sm:align-self-auto"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </header>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="sm:col-span-2 relative flex items-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800/80">
          <span className="material-symbols-outlined text-slate-500 text-lg mr-2">search</span>
          <input 
            type="text" 
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder-slate-650"
          />
        </div>
        <div>
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-350 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admins Only</option>
            <option value="Customer">Customers Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 text-center text-slate-500 text-sm">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            Retrieving user list...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 text-sm">
            <p className="font-bold">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No registered users match your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                          {u.firstName?.[0]?.toUpperCase()}{u.lastName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{u.firstName} {u.lastName}</p>
                          <span className="font-mono text-[10px] text-slate-500">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 font-semibold">{u.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{u.phoneNumber || 'No phone number'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        u.role === 'Admin' 
                          ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' 
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleRoleChange(u.id, u.role)}
                        disabled={updatingUserId === u.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          u.role === 'Admin'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-250 border-slate-700/60'
                            : 'bg-accent-yellow/10 hover:bg-accent-yellow/20 text-accent-yellow border-accent-yellow/20'
                        } disabled:opacity-50`}
                      >
                        {updatingUserId === u.id ? 'Updating...' : u.role === 'Admin' ? 'Make Customer' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

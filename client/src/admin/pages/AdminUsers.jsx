import { useState, useEffect } from "react";
import { Search, Edit2, ShieldAlert } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users?page=${pageNumber}&limit=10`);
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pages);
        setPage(data.page);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId, role, status) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, { role, status });
      if (data.success) {
        toast.success("User updated");
        setUsers(users.map(u => u._id === userId ? { ...u, role, status } : u));
        setEditingUser(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">User Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage accounts, roles, and access.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="h-10 pl-10 pr-4 rounded-lg border border-border-default bg-surface-card text-sm focus:outline-brand w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-surface-card border border-border-default rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 text-text-muted font-medium border-b border-border-default">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">XP</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-text-muted">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-text-muted">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">{u.name}</td>
                    <td className="px-6 py-4 text-text-muted">{u.email}</td>
                    <td className="px-6 py-4">
                      {editingUser === u._id ? (
                        <select 
                          className="h-8 px-2 text-xs rounded border border-border-default bg-surface-background"
                          defaultValue={u.role}
                          onChange={(e) => handleUpdateUser(u._id, e.target.value, u.status)}
                        >
                          <option value="user">User</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          u.role === 'admin' ? 'bg-brand/10 text-brand' : 
                          u.role === 'reviewer' ? 'bg-warning-bg text-warning-text' : 
                          'bg-black/5 text-text-muted'
                        }`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === u._id ? (
                        <select 
                          className="h-8 px-2 text-xs rounded border border-border-default bg-surface-background"
                          defaultValue={u.status}
                          onChange={(e) => handleUpdateUser(u._id, u.role, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="deactivated">Deactivated</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          u.status === 'active' ? 'bg-success-bg text-success-text' : 
                          u.status === 'suspended' ? 'bg-error-bg text-error-text' : 
                          'bg-black/10 text-text-muted'
                        }`}>
                          {u.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-muted">{u.xp} XP</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setEditingUser(editingUser === u._id ? null : u._id)}
                        className="p-1.5 text-text-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchUsers(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium border border-border-default rounded-lg hover:bg-black/5 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => fetchUsers(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium border border-border-default rounded-lg hover:bg-black/5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

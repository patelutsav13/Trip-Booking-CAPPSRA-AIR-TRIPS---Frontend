import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Check, X, Shield, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async (id) => {
    try {
      await axios.put(`/users/${id}`, { role: editRole });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage elite access roles and passenger accounts.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-dark-border font-semibold">
                <th className="p-4 py-3">Name</th>
                <th className="p-4 py-3">Email</th>
                <th className="p-4 py-3 text-center">Role</th>
                <th className="p-4 py-3 text-right">Joined</th>
                <th className="p-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border text-sm">
              {users.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-black text-lg">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                           {u.name} {u._id === currentUser._id && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">You</span>}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="p-4 text-center">
                       {editingId === u._id && !isAdmin ? (
                         <select 
                           value={editRole} 
                           onChange={(e) => setEditRole(e.target.value)}
                           className="border border-slate-300 rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 dark:text-white"
                         >
                           <option value="user">User</option>
                           <option value="admin">Admin</option>
                         </select>
                       ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1rounded-full text-xs font-bold uppercase ${isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                            {isAdmin ? <Shield size={12}/> : <UserIcon size={12}/>} {u.role}
                          </span>
                       )}
                    </td>
                    <td className="p-4 text-right text-slate-500 dark:text-slate-400 font-mono text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2 justify-center">
                      {!isAdmin && (
                        <>
                          {editingId === u._id ? (
                            <>
                              <button onClick={() => handleEditRole(u._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Save">
                                <Check size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="Cancel">
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => {setEditingId(u._id); setEditRole(u.role);}} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Role">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(u._id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete User">
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                      {isAdmin && (
                        <span className="text-xs text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

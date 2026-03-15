import { useState, useEffect } from 'react';
import axios from 'axios';
import { TicketPercent, Plus, Edit2, Trash2, X, Send, User } from 'lucide-react';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', code: '', description: '', discountType: 'percentage',
    discountValue: '', freebieDescription: '', expiryDate: '',
    isActive: true, color: '#3b82f6'
  });
  
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchCoupons();
    fetchUsers();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/users');
      // Only returning users (not admins) to send coupons to
      setUsers(data.filter(u => u.role === 'user'));
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', code: '', description: '', discountType: 'percentage',
      discountValue: '', freebieDescription: '', expiryDate: '',
      isActive: true, color: '#3b82f6'
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setFormData({
      title: coupon.title, code: coupon.code, description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue || '',
      freebieDescription: coupon.freebieDescription || '',
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      isActive: coupon.isActive, color: coupon.color || '#3b82f6'
    });
    setIsEditing(true);
    setCurrentId(coupon._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await axios.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/coupons/${currentId}`, formData);
      } else {
        await axios.post('/coupons', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const openSendModal = (coupon) => {
    setSelectedCoupon(coupon);
    setSelectedUserId('');
    setIsSendModalOpen(true);
  };

  const handleSendCoupon = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return alert('Please select a user');
    try {
      await axios.post(`/coupons/${selectedCoupon._id}/send`, { userId: selectedUserId });
      alert('Coupon sent successfully!');
      setIsSendModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send coupon. Remember, users must have at least one booking to receive coupons.');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Coupon Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create deals and send exclusive codes to your premium travelers.</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-xs">
          <Plus size={20} /> CREATE NEW COUPON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm flex flex-col relative">
            <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: coupon.color || '#3b82f6' }}></div>
            
            <div className="p-5 flex-1 mt-2">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-tighter border-2 border-white/20 shadow-lg">
                  {coupon.code}
                </span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${coupon.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{coupon.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{coupon.description}</p>
              
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                 <TicketPercent size={16} className="text-blue-600 focus:ring-blue-500"/> 
                 {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : 
                  coupon.discountType === 'fixed' ? `₹${coupon.discountValue} OFF` : 'FREEBIE'}
              </div>
              <p className="text-xs text-slate-400">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 flex justify-between gap-2 border-t border-slate-100 dark:border-dark-border">
              <div className="flex gap-1">
                <button onClick={() => openEditModal(coupon)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
              <button onClick={() => openSendModal(coupon)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm font-medium transition-colors">
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white uppercase font-mono focus:outline-none" placeholder="SUMMER50" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
                  <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="freebie">Freebie</option>
                  </select>
                </div>
                {formData.discountType !== 'freebie' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount Value</label>
                    <input type="number" required min="1" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                )}
                {formData.discountType === 'freebie' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Freebie Description</label>
                    <input type="text" required value={formData.freebieDescription} onChange={e => setFormData({...formData, freebieDescription: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Theme Color</label>
                  <input type="color" required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full h-11 p-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="couponActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="couponActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">Set as Active Coupon</label>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-dark-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Coupon Modal */}
      {isSendModalOpen && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Send size={20}/> Send Coupon</h2>
              <button onClick={() => setIsSendModalOpen(false)} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSendCoupon} className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                <p className="text-sm text-slate-500 mb-1">Sending:</p>
                <p className="font-bold text-slate-900 dark:text-white font-mono">{selectedCoupon.code} - {selectedCoupon.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"><User size={16} className="inline mr-1 -mt-1" />Select User</label>
                <select required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none">
                  <option value="">-- Choose User --</option>
                  {users.filter(u => u.bookingCount > 0).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email}) - {u.bookingCount} Booking(s)</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 italic">Note: Only users with at least 1 confirmed booking are shown here as they are the only ones eligible for coupons.</p>
              </div>

               <div className="pt-6 border-t border-slate-100 dark:border-dark-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsSendModalOpen(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"><Send size={18}/> Send Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

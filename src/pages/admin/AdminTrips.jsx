import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plane, Plus, Edit2, Trash2, X, UploadCloud, MapPin } from 'lucide-react';

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', from: '', to: '', location: '', description: '',
    price: '', startDate: '', endDate: '', availableSeats: '', rating: '4.5',
    category: 'International', airline: '', flightClass: 'Economy',
    departureTime: '', arrivalTime: '', highlights: '', isActive: true
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await axios.get('/trips');
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', from: '', to: '', location: '', description: '',
      price: '', startDate: '', endDate: '', availableSeats: '', rating: '4.5',
      category: 'International', airline: '', flightClass: 'Economy',
      departureTime: '', arrivalTime: '', highlights: '', isActive: true
    });
    setImageFiles([]);
    setExistingImages([]);
    setIsEditing(false);
    setCurrentId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (trip) => {
    const formatForInput = (dateStr) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
    setFormData({
      name: trip.name, from: trip.from, to: trip.to, location: trip.location,
      description: trip.description, price: trip.price, startDate: formatForInput(trip.startDate), endDate: formatForInput(trip.endDate),
      availableSeats: trip.availableSeats, rating: trip.rating, category: trip.category,
      airline: trip.airline, flightClass: trip.flightClass, departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime, highlights: trip.highlights?.join(', ') || '',
      isActive: trip.isActive
    });
    setExistingImages(trip.images || []);
    setImageFiles([]);
    setIsEditing(true);
    setCurrentId(trip._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await axios.delete(`/trips/${id}`);
      fetchTrips();
    } catch (err) {
      alert('Failed to delete trip');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length > 4) {
      alert('You can only upload a maximum of 4 images');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, idx) => idx !== indexToRemove));
  };
  
  const removeNewImage = (indexToRemove) => {
    setImageFiles(imageFiles.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    
    // Add all text fields
    // Add all fields with sanitization
    Object.keys(formData).forEach(key => {
      let value = formData[key];
      if (key === 'highlights') {
        value = JSON.stringify(value.split(',').map(s => s.trim()).filter(s => s));
      } else if (['price', 'availableSeats', 'rating'].includes(key)) {
        value = value === '' ? 0 : value;
      }
      submitData.append(key, value);
    });

    // Add existing images as a JSON string for the backend to parse
    if (isEditing) {
      submitData.set('existingImages', JSON.stringify(existingImages));
    }

    // Add new files
    imageFiles.forEach(file => {
      submitData.append('images', file);
    });

    try {
      if (isEditing) {
        await axios.put(`/trips/${currentId}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await axios.post('/trips', submitData, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      setIsModalOpen(false);
      resetForm();
      fetchTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Trip Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Add, edit, or remove luxury flight listings.</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <Plus size={20} /> ADD NEW TRIP
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-dark-border font-semibold">
                <th className="p-4 py-3">Trip / Airline</th>
                <th className="p-4 py-3">Route</th>
                <th className="p-4 py-3">Price</th>
                <th className="p-4 py-3 text-center">Status</th>
                <th className="p-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border text-sm">
              {trips.map((trip) => (
                <tr key={trip._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                        {trip.images && trip.images[0] ? (
                          <img src={`http://localhost:5000${trip.images[0]}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400"><Plane size={20}/></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{trip.name}</p>
                        <p className="text-xs text-slate-500 uppercase flex items-center gap-1 mt-0.5"><Plane size={10}/> {trip.airline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{trip.from} - {trip.to}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10}/> {trip.location}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-black text-blue-600 dark:text-blue-400 text-base">₹{trip.price}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${trip.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {trip.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEditModal(trip)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(trip._id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Trip' : 'Add New Trip'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="trip-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div className="space-y-3">
                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Trip Images (Max 4)</label>
                   <div className="flex flex-wrap gap-4">
                     {/* Existing Images */}
                     {existingImages.map((img, idx) => (
                       <div key={`old-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                         <img src={`http://localhost:5000${img}`} alt="" className="w-full h-full object-cover" />
                         <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                       </div>
                     ))}
                     {/* New Images */}
                     {imageFiles.map((file, idx) => (
                       <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-blue-500">
                         <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                         <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                       </div>
                     ))}
                     
                     {/* Upload Button */}
                     {(existingImages.length + imageFiles.length) < 4 && (
                       <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                         <UploadCloud className="text-slate-400 mb-1" size={24} />
                         <span className="text-[10px] text-slate-500 font-medium uppercase">Upload</span>
                         <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                       </label>
                     )}
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trip Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Code</label>
                      <input type="text" required placeholder="e.g. JFK" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value.toUpperCase()})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white uppercase" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To Code</label>
                      <input type="text" required placeholder="e.g. LHR" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value.toUpperCase()})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white uppercase" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location Name</label>
                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Airline</label>
                    <input type="text" required value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                    <input type="number" required min="1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seats Open</label>
                    <input type="number" required min="1" value={formData.availableSeats} onChange={e => setFormData({...formData, availableSeats: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                      <option value="International">International</option>
                      <option value="Domestic">Domestic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
                    <select value={formData.flightClass} onChange={e => setFormData({...formData, flightClass: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Departure Time</label>
                    <input type="text" required placeholder="10:00 AM" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arrival Time</label>
                    <input type="text" required placeholder="06:30 PM" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Highlights (comma separated)</label>
                  <input type="text" placeholder="Free Meals, Extra Baggage, Priority Boarding" value={formData.highlights} onChange={e => setFormData({...formData, highlights: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">Set as Active Trip (Visible to users)</label>
                </div>

              </form>
            </div>
            
            <div className="p-8 border-t border-slate-100 dark:border-dark-border flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-2xl font-black transition-all uppercase tracking-widest text-xs">
                Cancel
              </button>
              <button type="submit" form="trip-form" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-xs">
                {isEditing ? 'Save Changes' : 'Create Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;

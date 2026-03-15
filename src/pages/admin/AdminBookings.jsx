import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, Search, Plane, Calendar } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.trip?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Booking Monitor</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Real-time overview of all platform transactions.</p>
        </div>
        
        <div className="relative max-w-sm w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Ticket, User, Flight..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 border-2 border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-dark-border font-semibold">
                <th className="p-4 py-3">Ticket ID</th>
                <th className="p-4 py-3">Passenger & User</th>
                <th className="p-4 py-3">Flight & Route</th>
                <th className="p-4 py-3 text-center">Seats / Price</th>
                <th className="p-4 py-3 text-center">Status</th>
                <th className="p-4 py-3 text-right">Booking Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border text-sm">
              {filteredBookings.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No bookings found matching search</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                        <Ticket size={16} className="text-slate-400" /> {b.ticketId}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white capitalize">{b.passengers[0]?.name} {b.passengerCount > 1 && <span className="text-xs text-slate-500">+{b.passengerCount - 1} more</span>}</p>
                      <p className="text-xs text-slate-500">Booked by: {b.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1"><Plane size={12}/> {b.trip?.name}</p>
                      <p className="text-xs text-slate-500">{b.trip?.from} → {b.trip?.to}</p>
                    </td>
                    <td className="p-4 text-center">
                      <p className="font-medium text-slate-900 dark:text-white">{b.seatNumbers.join(', ')}</p>
                      <p className="font-black text-blue-600 dark:text-blue-400">₹{b.finalPrice}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        b.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500 dark:text-slate-400 flex flex-col items-end">
                      <p className="flex items-center gap-1"><Calendar size={12}/> {new Date(b.createdAt).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;

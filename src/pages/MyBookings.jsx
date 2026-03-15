import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, MapPin, XCircle, ArrowRight, Ticket } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/bookings/mybookings');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled', paymentStatus: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <Plane className="text-blue-600" size={48} /> MY <span className="text-blue-600">JOURNEYS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium">Manage your elite travels and upcoming destinations.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
            <Plane size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't booked any trips yet. Discover amazing destinations and start your journey.</p>
          <Link to="/trips" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            Explore Trips <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white dark:bg-dark-card border-2 border-slate-100 dark:border-dark-border rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col md:flex-row transition-all duration-500 hover:shadow-2xl hover:border-blue-500/20 group">
              
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">ID: {booking.ticketId}</span>
                  </div>
                  
                  {booking.status === 'upcoming' && (
                    <button onClick={() => handleCancel(booking._id)} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg">
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{booking.trip.name}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mt-4">
                  <div className="flex items-center gap-1.5"><MapPin size={18} className="text-blue-500" /> {booking.trip.from} to {booking.trip.location}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={18} className="text-blue-500" /> {new Date(booking.travelDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1.5"><Plane size={18} className="text-blue-500" /> {booking.trip.airline}</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#0f172a] p-10 md:w-80 border-t md:border-t-0 md:border-l-2 border-slate-100 dark:border-dark-border flex flex-col justify-center items-center text-center transition-colors group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Premium Investment</p>
                <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-6 tracking-tighter">₹{booking.finalPrice}</p>
                
                <Link to={`/ticket/${booking._id}`} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                  <Ticket size={18} /> View Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

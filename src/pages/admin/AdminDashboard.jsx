import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plane, Calendar, TicketPercent, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;
  if (!stats) return <div className="text-center text-red-500">Failed to load statistics</div>;

  const statCards = [
    { title: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Total Trips', value: stats.totalTrips, icon: Plane, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Active Coupons', value: stats.activeCoupons, icon: TicketPercent, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/30' },
  ];

  const maxMonthly = Math.max(...stats.monthlyBookings.map(m => m.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Platform performance and real-time statistics.</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200/50 dark:border-dark-border shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${card.bg}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">{card.title}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Simple Monthly Bar Chart visualization using standard HTML/CSS */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3"><TrendingUp size={24} className="text-blue-600"/> Bookings Performance</h2>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-64 pt-6">
            {stats.monthlyBookings.length === 0 ? (
               <div className="w-full h-full flex items-center justify-center text-slate-400">No data available</div>
            ) : (
               stats.monthlyBookings.map((month, idx) => {
                 const height = `${(month.count / maxMonthly) * 100}%`;
                  const monthName = month._id ? new Date(month._id.year || 2024, (month._id.month || 1) - 1).toLocaleString('default', { month: 'short' }) : 'N/A';
                 return (
                   <div key={idx} className="flex flex-col items-center flex-1 group">
                     <div className="w-full max-w-[40px] bg-blue-100 dark:bg-blue-900/30 rounded-t-lg relative flex justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors cursor-pointer" style={{ height }}>
                        <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {month.count}
                        </div>
                        <div className="w-full absolute bottom-0 bg-blue-500 rounded-t-lg transition-all duration-1000" style={{ height }}></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-3 font-medium">{monthName}</p>
                   </div>
                 );
               })
            )}
          </div>
        </div>

        {/* Popular Trips */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Most Booked Trips</h2>
          <div className="space-y-4">
            {stats.popularTrips.length === 0 ? (
               <div className="text-center text-slate-400 py-8">No bookings yet</div>
            ) : (
              stats.popularTrips.map((trip, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{trip.tripName}</p>
                      <p className="text-xs text-slate-500 truncate">{trip.location}</p>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{trip.count}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Bookings</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#0f172a] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-dark-border font-semibold">
                <th className="p-4 py-3">User</th>
                <th className="p-4 py-3">Trip</th>
                <th className="p-4 py-3">Amount</th>
                <th className="p-4 py-3">Status</th>
                <th className="p-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border text-sm">
              {stats.recentBookings.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No recent bookings</td></tr>
              ) : (
                stats.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.user?.name}</p>
                      <p className="text-xs text-slate-500">{b.user?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{b.trip?.name}</p>
                    </td>
                     <td className="p-4 font-black text-blue-600 dark:text-blue-400">₹{b.finalPrice}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500 dark:text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
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

export default AdminDashboard;

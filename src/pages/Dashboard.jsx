import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plane, Calendar, PlaneTakeoff, TicketPercent, Wallet, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ bookings: 0, spent: 0, activeCoupons: 0, upcomingFlights: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const [bookRes, coupRes] = await Promise.all([
          axios.get('/bookings/mybookings'),
          axios.get('/coupons/mycoupons')
        ]);
        
        const activeBookings = (bookRes.data || []).filter(b => b.status === 'upcoming');
        const totalSpent = (bookRes.data || []).filter(b => b.paymentStatus === 'confirmed').reduce((sum, b) => sum + (b.finalPrice || 0), 0);
        const activeCoup = (coupRes.data || []).filter(c => !c.isClaimed && c.coupon && new Date(c.coupon.expiryDate) > new Date()).length;

        setStats({
          bookings: (bookRes.data || []).length,
          upcomingFlights: activeBookings.length,
          spent: totalSpent,
          activeCoupons: activeCoup
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  const statCards = [
    { title: 'Upcoming Flights', value: stats.upcomingFlights, icon: PlaneTakeoff, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Total Spent', value: `₹${stats.spent.toFixed(2)}`, icon: Wallet, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Active Coupons', value: stats.activeCoupons, icon: TicketPercent, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}! 👋</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Here's your luxury travel overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-200/50 dark:border-dark-border shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-between group">
              <div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">{card.title}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{card.value}</p>
              </div>
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${card.bg}`}>
                <Icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0">
            <Plane size={350} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6 tracking-tight leading-tight max-w-xs">Ready for your next adventure?</h2>
            <p className="text-blue-100/80 mb-10 max-w-sm text-lg font-medium leading-relaxed">
              Explore 100+ new destinations. Book your next flight with exclusive member discounts.
            </p>
            <Link to="/trips" className="inline-flex items-center gap-2 bg-white text-blue-700 font-black py-4 px-10 rounded-2xl shadow-premium hover:shadow-premium-hover hover:-translate-y-1 transition-all">
              Book a Flight <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border border-slate-100 dark:border-dark-border shadow-sm flex flex-col justify-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Did you know?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">You earn a coupon for every booking you make. Use these coupons to get discounts or free upgrades on future flights!</p>
          <Link to="/coupons" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 transition-colors">
            View My Coupons 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronRight, LayoutDashboard, Ticket, TicketPercent, Plane } from 'lucide-react';
import CappsraLogo from '../components/CappsraLogo';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Sidebar - Desktop */}
      {user && (
        <aside className="w-72 bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/10 shadow-2xl">
          <div className="h-24 flex items-center px-6 border-b border-white/10">
            <Link to="/">
              <CappsraLogo variant="full" />
            </Link>
          </div>
          
          <div className="p-6 flex items-center gap-4 border-b border-white/10">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20 overflow-hidden">
               {user.avatar ? <img src={`${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-base font-black text-white truncate leading-tight">Hi, {user.name?.split(' ')[0] || 'Traveler'}!</p>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mt-1">Cappsra Member</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {[
              { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
              { name: 'My Bookings', path: '/my-bookings', icon: Ticket },
              { name: 'My Rewards', path: '/coupons', icon: TicketPercent },
              { name: 'Explore Trips', path: '/trips', icon: Plane },
            ].map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-5 py-4 text-xs font-black rounded-2xl transition-all duration-300 uppercase tracking-widest ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xl scale-105 active:scale-100' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-4 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white group-hover:scale-110 transition-transform'}`} />
                  {item.name}
                </Link>
              );
            })}

            {user.role === 'admin' && (
              <Link to="/admin" className="group flex items-center px-5 py-4 text-xs font-black rounded-2xl text-amber-300 hover:bg-white/10 hover:text-amber-200 mt-8 border-t border-white/10 pt-8 uppercase tracking-[0.2em]">
                Admin Dashboard <ChevronRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="group flex items-center px-4 py-3 text-sm font-bold rounded-xl w-full text-red-200 hover:bg-red-600 hover:text-white transition-all">
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-300 group-hover:text-white" />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm flex items-center justify-between px-8 border-b border-slate-100 dark:border-dark-border sticky top-0 z-10 transition-colors">
          <div>
            <Link to="/">
              <CappsraLogo variant="full" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
             {!user && (
               <>
                 <Link to="/login" className="text-sm font-black text-slate-600 hover:text-blue-600 uppercase tracking-widest transition-colors">Login</Link>
                 <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest">Sign Up</Link>
               </>
             )}
             {user && (
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black uppercase text-base border border-blue-100 dark:border-blue-900/50 overflow-hidden">
                    {user.avatar ? <img src={`${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                  </div>
               </div>
             )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

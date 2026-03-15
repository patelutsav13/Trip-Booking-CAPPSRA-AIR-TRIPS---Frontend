import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Users, Plane, Ticket, BookOpen, LogOut, Sun, Moon } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Trips', path: '/admin/trips', icon: Plane },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Bookings', path: '/admin/bookings', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-blue-800 to-indigo-950 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/5 shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-800 font-black text-2xl shadow-lg mr-4 border border-white/20">C</div>
          <span className="font-black text-2xl text-white tracking-tighter truncate">ADMIN <span className="text-blue-200">PORTAL</span></span>
        </div>
        
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20">
             {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-base font-black text-white truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold mt-1">General Administrator</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-5 py-4 text-sm font-black rounded-2xl transition-all duration-300 uppercase tracking-widest ${
                  isActive 
                    ? 'bg-white text-blue-800 shadow-xl scale-105 active:scale-100' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`mr-4 flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-800' : 'text-blue-300 group-hover:text-white group-hover:scale-110 transition-transform'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-dark-border">
          <button onClick={handleLogout} className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-red-100 hover:bg-red-500 hover:text-white transition-colors">
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-200 group-hover:text-white" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm flex items-center justify-between px-8 border-b border-slate-100 dark:border-dark-border">
          <div className="md:hidden font-black text-2xl text-blue-800 tracking-tighter">ADMIN PORTAL</div>
          <div className="flex flex-1 justify-end items-center gap-6">
             <Link to="/" className="text-sm font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest">View Live Website</Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

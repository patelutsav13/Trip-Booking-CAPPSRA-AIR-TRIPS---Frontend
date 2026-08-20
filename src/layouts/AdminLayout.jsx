import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Users, Plane, Ticket, BookOpen, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import CappsraLogo from '../components/CappsraLogo';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Trips', path: '/admin/trips', icon: Plane },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Bookings', path: '/admin/bookings', icon: BookOpen },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-x-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-gradient-to-b from-blue-900 to-indigo-950 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/5 shadow-2xl">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <CappsraLogo variant="full" />
          </Link>
        </div>
        
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20">
             {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-base font-black text-white truncate leading-tight">{user?.name}</p>
            <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold mt-1">General Administrator</p>
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
                    ? 'bg-white text-blue-900 shadow-xl scale-105 active:scale-100' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`mr-4 flex-shrink-0 h-5 w-5 ${isActive ? 'text-blue-900' : 'text-blue-300 group-hover:text-white group-hover:scale-110 transition-transform'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-red-200 hover:bg-red-600 hover:text-white transition-colors">
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-300 group-hover:text-white" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-20 bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm flex items-center justify-between px-4 md:px-8 border-b border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden focus:outline-none"
              title="Toggle Admin Sidebar"
            >
              <Menu size={26} />
            </button>

            <div onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="cursor-pointer flex items-center gap-2">
              <CappsraLogo variant="full" />
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md hidden sm:inline-block">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <Link to="/" className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest flex items-center gap-1">
               <ArrowLeft size={14} /> Back to Live App
             </Link>
          </div>
        </header>

        {/* Mobile Admin Sidebar Drawer */}
        {isMobileMenuOpen && (
          <>
            <div 
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            ></div>

            <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white shadow-2xl flex flex-col justify-between p-6 border-r border-white/10 md:hidden transform transition-all duration-300 animate-slide-in">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <Link to="/" onClick={closeMobileMenu}>
                    <CappsraLogo variant="full" />
                  </Link>
                  <button 
                    onClick={closeMobileMenu}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="py-5 border-b border-white/10 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20">
                     {user?.name?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-base font-black text-white truncate leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold mt-1">Administrator</p>
                  </div>
                </div>

                <nav className="py-6 space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`group flex items-center px-4 py-3.5 text-xs font-black rounded-2xl transition-all uppercase tracking-wider ${
                          isActive 
                            ? 'bg-white text-blue-950 shadow-lg' 
                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-950' : 'text-blue-300'}`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </aside>
          </>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

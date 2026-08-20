import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronRight, LayoutDashboard, Ticket, TicketPercent, Plane, Menu, X, Home, User, ShieldCheck, Sparkles } from 'lucide-react';
import CappsraLogo from '../components/CappsraLogo';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore Trips', path: '/trips', icon: Plane },
    ...(user ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'My Bookings', path: '/my-bookings', icon: Ticket },
      { name: 'My Rewards', path: '/coupons', icon: TicketPercent },
    ] : []),
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-bg overflow-x-hidden">
      
      {/* Sidebar - Desktop */}
      {user && (
        <aside className="w-72 bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-500 border-r border-white/10 shadow-2xl">
          <div className="h-24 flex items-center px-6 border-b border-white/10">
            <Link to="/" className="flex items-center">
              <CappsraLogo variant="full" />
            </Link>
          </div>
          
          <div className="p-6 flex items-center gap-4 border-b border-white/10">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20 overflow-hidden flex-shrink-0">
               {user.avatar ? <img src={`${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-base font-black text-white truncate leading-tight">Hi, {user.name?.split(' ')[0] || 'Traveler'}!</p>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mt-1">Cappsra Member</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navLinks.map((item) => {
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Navigation */}
        <header className="h-20 bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm flex items-center justify-between px-4 md:px-8 border-b border-slate-100 dark:border-dark-border sticky top-0 z-30 transition-colors">
          
          {/* Logo & Mobile Menu Toggle trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden focus:outline-none"
              title="Toggle Navigation Menu"
            >
              <Menu size={26} />
            </button>

            <div onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="cursor-pointer">
              <CappsraLogo variant="full" />
            </div>
          </div>

          {/* Desktop Right Header Actions */}
          <div className="flex items-center gap-4 md:gap-6">
             {!user ? (
               <div className="hidden sm:flex items-center gap-4">
                 <Link to="/login" className="text-xs md:text-sm font-black text-slate-600 hover:text-blue-600 uppercase tracking-widest transition-colors">Login</Link>
                 <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-2xl text-xs md:text-sm font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest">Sign Up</Link>
               </div>
             ) : (
               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user.name?.split(' ')[0]}</p>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Cappsra VIP</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black uppercase text-base border border-blue-100 dark:border-blue-900/50 overflow-hidden flex-shrink-0">
                    {user.avatar ? <img src={`${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                  </div>
               </div>
             )}
          </div>
        </header>

        {/* MOBILE DRAWER SIDEBAR (Toggled when clicking Logo or Menu icon on small devices) */}
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <div 
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            ></div>

            {/* Mobile Drawer Panel */}
            <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950 text-white shadow-2xl flex flex-col justify-between p-6 border-r border-white/10 md:hidden transform transition-all duration-300 animate-slide-in">
              <div>
                {/* Header inside drawer */}
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

                {/* User Info inside drawer */}
                {user ? (
                  <div className="py-5 border-b border-white/10 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black uppercase text-xl border border-white/20 overflow-hidden flex-shrink-0">
                      {user.avatar ? <img src={`${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-base font-black text-white truncate leading-tight">Hi, {user.name}!</p>
                      <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mt-1">Cappsra Member</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-5 border-b border-white/10 space-y-3">
                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Welcome to Cappsra Air Trips!</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        to="/login" 
                        onClick={closeMobileMenu}
                        className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-center text-xs uppercase"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={closeMobileMenu}
                        className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs uppercase shadow-md"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}

                {/* Navigation Links inside Mobile Drawer */}
                <nav className="py-6 space-y-2">
                  {navLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`group flex items-center px-4 py-3.5 text-xs font-black rounded-2xl transition-all uppercase tracking-wider ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                        {item.name}
                      </Link>
                    );
                  })}

                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={closeMobileMenu}
                      className="group flex items-center px-4 py-3.5 text-xs font-black rounded-2xl text-amber-300 bg-amber-500/10 border border-amber-400/20 uppercase tracking-widest mt-4"
                    >
                      <ShieldCheck className="mr-3 h-5 w-5 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <Sparkles size={12} className="text-amber-400" /> Cappsra Air Trips App
                    </span>
                  </div>
                )}
              </div>
            </aside>
          </>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;

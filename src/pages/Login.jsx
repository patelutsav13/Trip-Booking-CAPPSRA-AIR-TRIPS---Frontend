import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, X, CheckCircle2, KeyRound } from 'lucide-react';
import CappsraLogo from '../components/CappsraLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Google Auth Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const { login, loginWithGoogle, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail) return;
    setGoogleLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle({
        email: googleEmail.trim(),
        name: googleName.trim() || googleEmail.split('@')[0],
        googleId: `google_${Date.now()}`
      });
      setShowGoogleModal(false);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      const res = await forgotPassword(resetEmailInput.trim());
      setForgotSuccess(res.message || 'Password reset link sent to your email!');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send password reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-dark-border flex flex-col transition-all">
        
        {/* Header with Logo */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-8 text-center text-white relative overflow-hidden flex flex-col items-center">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="mb-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <CappsraLogo showText={false} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-1">Welcome Back</h2>
          <p className="text-blue-100/80 text-sm font-medium">Access your luxury travels & coupons</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-sm mb-6 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Continue with Google Account Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-6 rounded-2xl border-2 border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-bold transition-all shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-200 dark:border-dark-border"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or sign in with email</span>
            <div className="flex-grow border-t border-slate-200 dark:border-dark-border"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-dark-border rounded-xl bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-dark-border rounded-xl bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-base font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 transition-all active:scale-95 uppercase tracking-widest mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-dark-border relative">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your real Google email address to log in and receive your 3 Free Welcome Discount Coupons via email!
              </p>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Your Original Google Email
                </label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Your Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={googleLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 disabled:opacity-70 mt-2"
              >
                {googleLoading ? 'Signing in & Sending Email...' : 'Continue & Claim 3 Coupons 🎁'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-dark-border relative">
            <button
              onClick={() => { setShowForgotModal(false); setForgotSuccess(''); setForgotError(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-amber-400">
                <KeyRound size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Forgot Password</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your real registered email address. We will send a secure password reset link directly to your inbox.
              </p>
            </div>

            {forgotError && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs mb-4 border border-red-200 dark:border-red-800">
                {forgotError}
              </div>
            )}

            {forgotSuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs mb-4 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto" />
                <p className="font-bold text-sm">{forgotSuccess}</p>
                <p>Please check your inbox (and spam folder) for the reset link.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Your Real Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmailInput}
                    onChange={(e) => setResetEmailInput(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70"
                >
                  {forgotLoading ? 'Sending Reset Email...' : 'Send Reset Link 📩'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

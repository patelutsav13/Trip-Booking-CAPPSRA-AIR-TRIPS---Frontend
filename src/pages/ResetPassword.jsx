import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import CappsraLogo from '../components/CappsraLogo';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
      setSuccess(res.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-dark-border flex flex-col transition-all">
        
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-center text-white relative overflow-hidden">
          <div className="flex justify-center mb-4">
            <CappsraLogo showText={false} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Reset Password</h2>
          <p className="text-blue-200/80 text-sm">Enter your new secure password below</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm mb-6 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>{success} Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Updating Password...' : 'Save New Password'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

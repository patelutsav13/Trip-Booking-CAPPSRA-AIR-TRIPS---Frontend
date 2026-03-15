import { useState, useEffect } from 'react';
import axios from 'axios';
import { TicketPercent, Search, CheckCircle2, Clock } from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get('/coupons/mycoupons');
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            <TicketPercent className="text-blue-600" size={48} /> MY <span className="text-blue-600">REWARDS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-xl font-medium">Unlock exclusive deals for your next luxury destination.</p>
        </div>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
            <TicketPercent size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No coupons available</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Book your first trip to unlock exclusive rewards and discount codes!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((claim) => {
            const c = claim.coupon;
            const isExpired = new Date(c.expiryDate) < new Date();
            const isActive = !claim.isClaimed && !isExpired;
            
            return (
              <div key={claim._id} className={`relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 ${
                claim.isClaimed ? 'bg-slate-50 border-slate-200 dark:bg-[#0f172a] dark:border-slate-800 opacity-60 scale-95' :
                isExpired ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30 grayscale opacity-70' :
                'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border shadow-xl hover:shadow-2xl hover:-translate-y-2'
              }`}>
                {/* Coupon Header Color Bar */}
                <div className="h-2 w-full" style={{ backgroundColor: c.color || '#3b82f6' }}></div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: c.color || '#3b82f6' }}>
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : 
                       c.discountType === 'fixed' ? `₹${c.discountValue}` : 'FREE'}
                    </div>
                    
                    {claim.isClaimed ? (
                       <span className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 uppercase">
                         <CheckCircle2 size={12}/> Used
                       </span>
                    ) : isExpired ? (
                       <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-md text-xs font-bold uppercase">
                         Expired
                       </span>
                    ) : (
                       <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 uppercase">
                         <Clock size={12}/> Active
                       </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">{c.description}</p>
                  
                  <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-3 bg-slate-50 dark:bg-[#0f172a] flex justify-between items-center relative">
                    <span className="font-mono text-lg font-bold tracking-widest text-slate-800 dark:text-white">{c.code}</span>
                    <button 
                      disabled={!isActive}
                      onClick={() => !claim.isClaimed && !isExpired && navigator.clipboard.writeText(c.code).then(()=>alert('Copied!'))}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      COPY
                    </button>
                    
                    {/* Cutouts */}
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-r border-slate-100 dark:border-dark-border"></div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-dark-card border-l border-slate-100 dark:border-dark-border"></div>
                  </div>
                  
                  <p className="text-center text-xs text-slate-400 mt-4">
                     Valid until {new Date(c.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Coupons;

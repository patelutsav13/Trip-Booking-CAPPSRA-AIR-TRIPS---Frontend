import { useState, useEffect } from 'react';
import axios from 'axios';
import { TicketPercent, CheckCircle2, Clock, Sparkles, Gift, Crown, CreditCard, ShieldCheck, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const Coupons = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingType, setClaimingType] = useState(null); // 'diwali', 'winter', 'summer'
  const [festivalMsg, setFestivalMsg] = useState('');

  // Subscription Modal State
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [subscribing, setSubscribing] = useState(false);
  const [subSuccess, setSubSuccess] = useState(null);

  const fetchMyCoupons = async () => {
    try {
      const { data } = await axios.get('/coupons/mycoupons');
      setClaims(data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCoupons();
  }, []);

  // Compute claimed festival status for current year
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).getTime();

  const claimedSources = new Set(
    claims
      .filter(c => new Date(c.createdAt).getTime() >= startOfYear)
      .map(c => c.claimSource)
  );

  const isDiwaliClaimed = claimedSources.has('festival_diwali');
  const isWinterClaimed = claimedSources.has('festival_winter');
  const isSummerClaimed = claimedSources.has('festival_summer');

  const handleClaimFestivalBonus = async (festivalType) => {
    setClaimingType(festivalType);
    setFestivalMsg('');
    try {
      const { data } = await axios.post('/coupons/festival-bonus', { festivalType });
      setFestivalMsg(data.message);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      await fetchMyCoupons();
    } catch (err) {
      setFestivalMsg(err.response?.data?.message || 'Failed to claim bonus coupons.');
    } finally {
      setClaimingType(null);
    }
  };

  const handleSubscribePayment = async () => {
    if (!selectedPackage) return;
    setSubscribing(true);
    try {
      const { data } = await axios.post('/coupons/subscribe', {
        packageType: selectedPackage,
        paymentMethod
      });
      setSubSuccess(data.message);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
      await fetchMyCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription payment failed.');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center h-64 items-center">
      <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-10 h-10"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            <Sparkles size={14} /> Exclusive Rewards Locker
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
            <TicketPercent className="text-blue-400" size={44} /> MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">DISCOUNT REWARDS</span>
          </h1>
          <p className="text-slate-300 text-base max-w-xl">
            Claim festival bonuses, subscribe to VIP coupon passes, and apply discounts to your flight bookings.
          </p>
        </div>
        <div className="flex-shrink-0 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
            <span className="text-3xl font-black text-amber-300">{claims.length}</span>
            <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Coupons Unlocked</span>
          </div>
        </div>
      </div>

      {/* FESTIVAL & VACATION BONUS SECTION */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Gift size={14} /> Real-Time Festival & Vacation Bonuses
            </span>
            <h2 className="text-2xl font-black mt-2">Claim 2 Free Bonus Discount Coupons</h2>
            <p className="text-emerald-100/80 text-sm mt-1">
              Available 3 times a year (Diwali, New Year, Summer Vacation). Unused coupons are never duplicated!
            </p>
          </div>
        </div>

        {festivalMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
            <span>{festivalMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Diwali Bonus Card */}
          <div className={`backdrop-blur-md border p-6 rounded-2xl flex flex-col justify-between transition-all ${
            isDiwaliClaimed ? 'bg-emerald-900/30 border-emerald-500/40' : 'bg-white/10 border-white/15 hover:bg-white/15'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl">🪔</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  isDiwaliClaimed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}>
                  {isDiwaliClaimed ? 'CLAIMED ✓' : '10 Days Before Diwali'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white">Diwali Festival Bonus</h3>
              <p className="text-xs text-slate-300 mt-1">2 Free Random Discount Coupons sent directly to your email.</p>
            </div>
            
            <button
              disabled={claimingType === 'diwali' || isDiwaliClaimed}
              onClick={() => handleClaimFestivalBonus('diwali')}
              className={`mt-5 w-full py-3 px-4 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                isDiwaliClaimed 
                  ? 'bg-emerald-600/60 text-emerald-200 cursor-not-allowed border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg'
              }`}
            >
              {claimingType === 'diwali' ? 'Claiming...' : isDiwaliClaimed ? 'CLAIMED ✓' : 'Claim Diwali Bonus 🎉'}
            </button>
          </div>

          {/* Winter / New Year Bonus Card */}
          <div className={`backdrop-blur-md border p-6 rounded-2xl flex flex-col justify-between transition-all ${
            isWinterClaimed ? 'bg-emerald-900/30 border-emerald-500/40' : 'bg-white/10 border-white/15 hover:bg-white/15'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl">❄️</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  isWinterClaimed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                }`}>
                  {isWinterClaimed ? 'CLAIMED ✓' : '01/01 (Every Year)'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white">Winter / New Year Bonus</h3>
              <p className="text-xs text-slate-300 mt-1">2 Free Bonus Coupons to start your new year travels.</p>
            </div>

            <button
              disabled={claimingType === 'winter' || isWinterClaimed}
              onClick={() => handleClaimFestivalBonus('winter')}
              className={`mt-5 w-full py-3 px-4 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                isWinterClaimed 
                  ? 'bg-emerald-600/60 text-emerald-200 cursor-not-allowed border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg'
              }`}
            >
              {claimingType === 'winter' ? 'Claiming...' : isWinterClaimed ? 'CLAIMED ✓' : 'Claim Winter Bonus ❄️'}
            </button>
          </div>

          {/* Summer Vacation Bonus Card */}
          <div className={`backdrop-blur-md border p-6 rounded-2xl flex flex-col justify-between transition-all ${
            isSummerClaimed ? 'bg-emerald-900/30 border-emerald-500/40' : 'bg-white/10 border-white/15 hover:bg-white/15'
          }`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl">☀️</span>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  isSummerClaimed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                }`}>
                  {isSummerClaimed ? 'CLAIMED ✓' : '01/04 (Summer Vac)'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white">Summer Vacation Bonus</h3>
              <p className="text-xs text-slate-300 mt-1">2 Free Bonus Coupons for summer trip planning.</p>
            </div>

            <button
              disabled={claimingType === 'summer' || isSummerClaimed}
              onClick={() => handleClaimFestivalBonus('summer')}
              className={`mt-5 w-full py-3 px-4 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                isSummerClaimed 
                  ? 'bg-emerald-600/60 text-emerald-200 cursor-not-allowed border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg'
              }`}
            >
              {claimingType === 'summer' ? 'Claiming...' : isSummerClaimed ? 'CLAIMED ✓' : 'Claim Summer Bonus ☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION PACKAGES SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Crown size={14} /> VIP Subscription Passes
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Coupon Subscription Packages</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Subscribe to unlock guaranteed fixed premium discount coupons instantly with instant Nodemailer receipt!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 6-Month Subscription Card */}
          <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border-2 border-purple-200 dark:border-purple-900/50 shadow-xl relative overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-extrabold uppercase">
                    6 Months Validity
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">Half-Yearly Pass</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-purple-600 dark:text-purple-400">₹5,000</span>
                  <span className="block text-[11px] text-slate-400 font-bold uppercase">One-time payment</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Get 5 fixed premium discount coupons valid for 6 full months across all international & domestic flights.
              </p>

              <ul className="space-y-3 mb-8 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span><strong>5 Fixed Coupons</strong> (10%, 20%, 30%, Free Meal, Free Hotel)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span>Valid for 6 Months from purchase date</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span>Instant Nodemailer Invoice & Coupon details email</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { setSelectedPackage('6months'); setSubSuccess(null); }}
              className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <Zap size={18} /> Subscribe for ₹5,000
            </button>
          </div>

          {/* Yearly Subscription Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all">
            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
              Best Value • Save Big
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase border border-amber-400/30">
                    1 Year Validity
                  </span>
                  <h3 className="text-2xl font-black mt-2 flex items-center gap-2">
                    Yearly VIP Pass <Crown size={22} className="text-amber-400" />
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-400">₹8,000</span>
                  <span className="block text-[11px] text-slate-400 font-bold uppercase">One-time payment</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-6">
                Get 8 fixed ultimate discount coupons valid for 1 full year including 50% HALF PRICE flight coupons!
              </p>

              <ul className="space-y-3 mb-8 text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />
                  <span><strong>8 Fixed Premium Coupons</strong> (Includes 50% OFF, Free Meal, Hotel & Transfers)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />
                  <span>Full 1 Year Validity</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />
                  <span>Priority Nodemailer Confirmation & Coupon Invoice</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => { setSelectedPackage('yearly'); setSubSuccess(null); }}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <Crown size={18} /> Subscribe Yearly for ₹8,000
            </button>
          </div>
        </div>
      </div>

      {/* MY COUPON LOCKER LIST */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Coupon Locker ({claims.length})</h2>

        {claims.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <TicketPercent size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No coupons claimed yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Claim your festival bonus or subscribe to a package above to unlock discount codes!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claims.map((claim) => {
              const c = claim.coupon;
              if (!c) return null;
              const isExpired = new Date(c.expiryDate) < new Date();
              const isActive = !claim.isClaimed && !isExpired;
              
              return (
                <div key={claim._id} className={`relative overflow-hidden rounded-[2rem] border-2 transition-all duration-500 ${
                  claim.isClaimed ? 'bg-slate-50 border-slate-200 dark:bg-[#0f172a] dark:border-slate-800 opacity-60 scale-95' :
                  isExpired ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30 grayscale opacity-70' :
                  'bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border shadow-xl hover:shadow-2xl hover:-translate-y-2'
                }`}>
                  <div className="h-2.5 w-full" style={{ backgroundColor: c.color || '#3b82f6' }}></div>
                  
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
                        onClick={() => navigator.clipboard.writeText(c.code).then(() => alert(`Copied coupon code: ${c.code}`))}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        COPY
                      </button>
                      
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

      {/* SUBSCRIPTION PAYMENT MODAL */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-card max-w-lg w-full rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-dark-border relative">
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>

            {subSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🎉
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Payment Successful!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{subSuccess}</p>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-4"
                >
                  View My New Coupons
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Confirm Subscription</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedPackage === '6months' ? '6-Month Package (₹5,000)' : 'Yearly VIP Package (₹8,000)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'card' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600' : 'border-slate-200 dark:border-dark-border text-slate-600'
                        }`}
                      >
                        <CreditCard size={16} /> Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'upi' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600' : 'border-slate-200 dark:border-dark-border text-slate-600'
                        }`}
                      >
                        <Zap size={16} /> UPI / GPay / PhonePe
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        defaultValue="Utsav Patel"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                        defaultValue="4532 8912 3456 7890"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="12/28"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-sm"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          defaultValue="888"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. user@okaxis)"
                        defaultValue="utsav@upi"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-dark-border bg-white dark:bg-[#0f172a] text-sm"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>256-bit Encrypted Secure Checkout</span>
                  </div>
                </div>

                <button
                  disabled={subscribing}
                  onClick={handleSubscribePayment}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95 uppercase tracking-widest text-sm disabled:opacity-70"
                >
                  {subscribing ? 'Processing Payment...' : `Pay ₹${selectedPackage === '6months' ? '5,000' : '8,000'} & Activate`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;

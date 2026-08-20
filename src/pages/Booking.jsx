import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, Users, MapPin, Ticket, ShieldCheck, Minus, Plus, CheckCircle2, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const [travelDate, setTravelDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
  
  const [availableClaims, setAvailableClaims] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, couponsRes] = await Promise.all([
          axios.get(`/trips/${id}`),
          axios.get('/coupons/mycoupons')
        ]);
        setTrip(tripRes.data);
        
        // Filter claims that are NOT used in booking yet and NOT expired
        const activeUserClaims = (couponsRes.data || []).filter(c => 
          c.coupon && 
          !c.usedInBooking && 
          new Date(c.coupon.expiryDate) > new Date()
        );
        setAvailableClaims(activeUserClaims);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const updateCount = (newCount) => {
    if (newCount < 1 || newCount > (trip?.availableSeats || 5) || newCount > 5) return;
    setPassengerCount(newCount);
    
    if (newCount > passengers.length) {
      const added = Array(newCount - passengers.length).fill({ name: '', age: '', gender: 'Male' });
      setPassengers([...passengers, ...added]);
    } else {
      setPassengers(passengers.slice(0, newCount));
    }
  };

  const handleApplyCouponByCode = (codeToApply) => {
    const code = (codeToApply || selectedCouponCode).trim().toUpperCase();
    if (!code) return;

    const claim = availableClaims.find(c => c.coupon && c.coupon.code === code);
    if (claim) {
      setAppliedCoupon(claim);
      setSelectedCouponCode(code);
      setError('');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
      setError('Invalid, expired, or already used coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setSelectedCouponCode('');
  };

  const calculateTotal = () => {
    if (!trip) return 0;
    const baseTotal = trip.price * passengerCount;
    if (!appliedCoupon || !appliedCoupon.coupon) return baseTotal;
    
    const { discountType, discountValue } = appliedCoupon.coupon;
    if (discountType === 'percentage') {
      return baseTotal - (baseTotal * (discountValue / 100));
    } else if (discountType === 'fixed') {
      return Math.max(0, baseTotal - discountValue);
    }
    return baseTotal;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (passengers.some(p => !p.name || !p.age)) return setError('Please fill all passenger details');
    if (!travelDate) return setError('Please select a travel date');
    
    setProcessing(true);
    setError('');
    try {
      const { data } = await axios.post('/bookings', {
        tripId: trip._id,
        travelDate,
        passengers,
        couponClaimId: appliedCoupon ? appliedCoupon._id : undefined
      });
      navigate(`/ticket/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center h-96 items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-12 h-12"></div></div>;
  if (!trip) return <div className="text-center mt-10 text-xl font-bold">Trip not found</div>;

  const baseTotal = trip.price * passengerCount;
  const finalTotal = calculateTotal();
  const discountAmount = baseTotal - finalTotal;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Plane size={300} />
        </div>
        <div className="relative z-10">
          <p className="text-blue-300 uppercase tracking-widest font-bold text-sm mb-2">Secure Checkout</p>
          <h1 className="text-3xl md:text-5xl font-black mb-4">{trip.name}</h1>
          <p className="flex items-center text-blue-100 text-lg">
            <MapPin className="h-5 w-5 mr-2" /> {trip.from} to {trip.location}
          </p>
        </div>
        <div className="relative z-10 text-center md:text-right">
          <p className="text-blue-200 text-lg font-medium">Flight Details</p>
          <p className="text-2xl font-bold">{trip.airline}</p>
          <p className="text-blue-100">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} • {trip.flightClass}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">{error}</div>}
          
          <form id="booking-form" onSubmit={handleBook} className="space-y-6">
            
            {/* Travel Details */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="text-blue-500" /> Travel Selection
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Travel Date</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-[#0f172a] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Number of Passengers</label>
                  <div className="flex items-center border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-[#0f172a] rounded-xl overflow-hidden">
                    <button type="button" onClick={() => updateCount(passengerCount - 1)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"><Minus size={18} /></button>
                    <div className="flex-1 text-center font-bold text-slate-900 dark:text-white">{passengerCount}</div>
                    <button type="button" onClick={() => updateCount(passengerCount + 1)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"><Plus size={18} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Forms */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border space-y-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="text-blue-500" /> Passenger Details
              </h2>
              
              {passengers.map((p, index) => (
                <div key={index} className="p-5 border border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-[#0f172a]/50 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Passenger {index + 1}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                       <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Full Name</label>
                       <input 
                         type="text" required value={p.name} onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                         className="w-full p-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         placeholder="John Doe"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Age</label>
                       <input 
                         type="number" min="1" max="120" required value={p.age} onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                         className="w-full p-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                         placeholder="30"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-1">Gender</label>
                       <select 
                         value={p.gender} onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                         className="w-full p-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                       >
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Other">Other</option>
                       </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </form>
        </div>

        {/* Right Col: Summary & Payment */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-dark-border pb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Base Price (x{passengerCount})</span>
                <span className="font-semibold">₹{baseTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-medium p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Ticket size={16} /> 
                    <div>
                      <span className="font-bold block">{appliedCoupon.coupon.code}</span>
                      <span className="text-[10px] text-green-700 dark:text-green-300">Applied Discount</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                    <button onClick={removeAppliedCoupon} className="text-xs text-red-500 underline font-bold">Remove</button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-dark-border pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* APPLY PROMO COUPON SECTION */}
            <div className="mb-6 space-y-3 p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-dark-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag size={14} className="text-blue-500" /> Apply Discount Coupon
              </label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={selectedCouponCode}
                  onChange={(e) => setSelectedCouponCode(e.target.value)}
                  placeholder="Enter Promo Code" 
                  className="flex-1 px-3 py-2.5 border border-slate-300 dark:border-dark-border bg-white dark:bg-[#151b2d] rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:text-white uppercase font-mono font-bold"
                />
                <button 
                  type="button" 
                  onClick={() => handleApplyCouponByCode()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md active:scale-95"
                >
                  Apply
                </button>
              </div>

              {/* Available Coupons Dropdown / Quick Select List */}
              {availableClaims.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-dark-border">
                  <span className="block text-[11px] font-bold text-slate-500 mb-2">Available Coupons in Locker ({availableClaims.length}):</span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {availableClaims.map((c) => {
                      const isSelected = appliedCoupon?._id === c._id;
                      return (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => handleApplyCouponByCode(c.coupon.code)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold flex items-center gap-1 transition-all ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-500' 
                              : 'bg-white dark:bg-dark-card border-blue-300 text-blue-600 dark:text-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {c.coupon.code} {c.coupon.discountType === 'percentage' ? `(${c.coupon.discountValue}%)` : `(₹${c.coupon.discountValue})`}
                          {isSelected && <CheckCircle2 size={12} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              form="booking-form"
              disabled={processing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {processing ? 'Processing Secure Payment...' : 'Confirm & Pay Securely'}
              {!processing && <ShieldCheck className="h-5 w-5 ml-1" />}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" /> 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

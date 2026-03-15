import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, MapPin, User, Download, Printer, CheckCircle2 } from 'lucide-react';

const DigitalTicket = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`/bookings/${id}`);
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex justify-center h-screen items-center"><div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-12 h-12"></div></div>;
  if (!booking) return <div className="text-center mt-20 text-xl font-bold">Ticket not found</div>;

  const { trip, user, passengers } = booking;

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6">
      <div className="flex justify-between items-center mb-8 px-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> Booking Confirmed!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your digital boarding pass.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="bg-slate-100 hover:bg-slate-200 dark:bg-dark-card dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <div className="space-y-8" ref={printRef}>
        {passengers.map((passenger, index) => (
          <div key={index} className="relative bg-white dark:bg-dark-card shadow-2xl rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-border mx-4 flex flex-col md:flex-row print:shadow-none print:border-slate-300">
            
            {/* Ticket Left Side */}
            <div className="flex-1 p-6 md:p-8 relative border-b md:border-b-0 md:border-r border-dashed border-slate-300 dark:border-slate-700">
              {/* Airplane Cutouts */}
              <div className="ticket-cutout-left hidden md:block"></div>
              <div className="ticket-cutout-right hidden md:block"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black tracking-widest text-xl mb-1 uppercase">
                    <Plane className="fill-current transform " size={24} /> {trip.airline}
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1"><MapPin size={12}/> {trip.category} FLIGHT</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Boarding Pass</p>
                  <p className="font-mono font-bold text-slate-800 dark:text-white tracking-wider">{booking.ticketId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 relative">
                <div className="text-center z-10 bg-white dark:bg-dark-card px-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white mb-1 uppercase leading-none">{trip.from.substring(0, 3)}</p>
                  <p className="text-sm font-medium text-slate-500">{trip.from}</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center relative px-4">
                  <div className="w-full absolute top-1/2 left-0 border-t-2 border-dashed border-slate-300 dark:border-slate-700 -z-0"></div>
                  <Plane className="text-blue-500 bg-white dark:bg-dark-card px-2 z-10" size={32} />
                  <span className="text-xs font-semibold text-slate-400 bg-white dark:bg-dark-card px-2 mt-2 z-10 whitespace-nowrap">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                </div>

                <div className="text-center z-10 bg-white dark:bg-dark-card px-2">
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1 uppercase leading-none">{trip.to.substring(0, 3)}</p>
                  <p className="text-sm font-medium text-slate-500">{trip.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Passenger</p>
                  <p className="font-bold text-slate-900 dark:text-white uppercase truncate" title={passenger.name}>{passenger.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Date</p>
                  <p className="font-bold text-slate-900 dark:text-white">{new Date(booking.travelDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Flight</p>
                  <p className="font-bold text-slate-900 dark:text-white">{trip.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-1">Seat</p>
                  <p className="font-black text-blue-600 dark:text-blue-400 text-lg leading-none">{booking.seatNumbers[index] || 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Ticket Right Side (Stub) */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-[#0f172a] p-6 md:p-8 flex flex-col items-center justify-center relative">
              <div className="ticket-cutout-left hidden md:block"></div>
              
              <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-sm mb-4">
                <img src={booking.qrCode} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <p className="text-xs text-slate-500 font-mono text-center mb-4 break-all px-4">{booking.ticketId}</p>
              
              <div className="w-full border-t border-slate-200 dark:border-slate-700 pt-4 text-center">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Boarding Time</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{trip.departureTime}</p>
                <p className="text-[10px] text-slate-500 mt-2">Gate closes 30 mins before departure</p>
              </div>
            </div>
          </div>
        ))}

        {/* Invoice Summary (No print) */}
        <div className="mx-4 mt-8 bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm no-print">
          <h3 className="font-bold text-lg mb-4 dark:text-white border-b border-slate-100 dark:border-dark-border pb-2">Payment Summary</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
             <div className="flex justify-between">
               <span>Base Fare ({booking.passengerCount}x)</span>
               <span>₹{booking.tripPrice * booking.passengerCount}</span>
             </div>
             {booking.discountAmount > 0 && (
               <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                 <span>Coupon Discount</span>
                 <span>-₹{booking.discountAmount}</span>
               </div>
             )}
             <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-dark-border mt-2">
               <span>Total Paid</span>
               <span className="text-blue-600 dark:text-blue-400">₹{booking.finalPrice}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTicket;

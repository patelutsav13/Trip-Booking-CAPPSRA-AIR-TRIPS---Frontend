// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { MapPin, Calendar, Plane, Star, Clock, Info, CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';

// const TripDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeImage, setActiveImage] = useState(0);

//   useEffect(() => {
//     const fetchTrip = async () => {
//       try {
//         const { data } = await axios.get(`/trips/${id}`);
//         setTrip(data);
//       } catch (err) {
//         setError('Failed to load trip details');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrip();
//   }, [id]);

//   if (loading) return <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
//   if (error) return <div className="text-center text-red-500 text-xl font-semibold mt-10">{error}</div>;
//   if (!trip) return <div className="text-center text-slate-500 text-xl mt-10">Trip not found.</div>;

//   const images = trip.images && trip.images.length > 0 ? trip.images : ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"];

//   const handleBookNow = () => {
//     if (!user) {
//       navigate('/login');
//     } else {
//       navigate(`/book/${trip._id}`);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
//       {/* Header & Breadcrumbs route can be added here if needed */}
//       <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 dark:text-slate-400 transition-colors font-medium">
//         <ChevronLeft className="h-5 w-5 mr-1" /> Back to result
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left Col: Images & Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Main Image Gallery */}
//           <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-dark-border">
//             <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4 group">
//               <img 
//                 src={images[activeImage].startsWith('/') ? `http://localhost:5000${images[activeImage]}` : images[activeImage]} 
//                 alt={trip.name} 
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//               />
//               {images.length > 1 && (
//                 <>
//                   <button 
//                     onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black p-2 rounded-full backdrop-blur transition-all"
//                   >
//                     <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
//                   </button>
//                   <button 
//                     onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black p-2 rounded-full backdrop-blur transition-all"
//                   >
//                     <ChevronRight className="h-6 w-6 text-slate-900 dark:text-white" />
//                   </button>
//                 </>
//               )}
//               <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold uppercase text-xs tracking-wider shadow">
//                 {trip.category}
//               </div>
//             </div>
            
//             {/* Thumbnail Navigation */}
//             {images.length > 1 && (
//               <div className="flex gap-4 overflow-x-auto pb-2">
//                 {images.map((img, idx) => (
//                   <button 
//                     key={idx} 
//                     onClick={() => setActiveImage(idx)}
//                     className={`h-24 min-w-[120px] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                   >
//                     <img src={img.startsWith('/') ? `http://localhost:5000${img}` : img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Details Overview */}
//           <div className="bg-white dark:bg-dark-card rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-dark-border">
//             <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
//               <div>
//                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{trip.name}</h1>
//                 <p className="flex items-center text-xl text-slate-500 font-medium italic">
//                   <MapPin className="h-6 w-6 mr-2 text-blue-600" /> {trip.from} to {trip.location}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 bg-yellow-400/10 dark:bg-yellow-400/5 px-6 py-3 rounded-2xl text-yellow-700 dark:text-yellow-500 border border-yellow-400/20 shadow-sm">
//                 <Star className="h-6 w-6 fill-current" />
//                 <span className="text-2xl font-black">{trip.rating}</span>
//                 <span className="text-sm font-bold uppercase tracking-wider">Excellent</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//               <div className="bg-[#f0f9ff] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-blue-100/50 dark:border-dark-border shadow-sm">
//                 <Plane className="h-7 w-7 text-blue-600 mb-3" />
//                 <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Airline</span>
//                 <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.airline}</span>
//               </div>
//               <div className="bg-[#f5f3ff] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-indigo-100/50 dark:border-dark-border shadow-sm">
//                 <Calendar className="h-7 w-7 text-indigo-600 mb-3" />
//                 <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Dates</span>
//                 <span className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">{new Date(trip.startDate).toLocaleDateString()} - <br/>{new Date(trip.endDate).toLocaleDateString()}</span>
//               </div>
//               <div className="bg-[#fff7ed] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-orange-100/50 dark:border-dark-border shadow-sm">
//                 <Clock className="h-7 w-7 text-orange-600 mb-3" />
//                 <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Class</span>
//                 <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.flightClass}</span>
//               </div>
//               <div className="bg-[#f0fdf4] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-green-100/50 dark:border-dark-border shadow-sm">
//                 <User className="h-7 w-7 text-green-600 mb-3" />
//                 <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Availability</span>
//                 <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.availableSeats} Seats</span>
//               </div>
//             </div>

//             <div className="prose prose-slate dark:prose-invert max-w-none">
//               <h3 className="flex items-center text-xl font-bold mb-4 text-slate-800"><Info className="h-5 w-5 mr-2 text-blue-500" /> About This Flight</h3>
//               <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{trip.description}</p>
//             </div>

//             {trip.highlights && trip.highlights.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Trip Highlights</h3>
//                 <div className="grid sm:grid-cols-2 gap-3">
//                   {trip.highlights.map((h, i) => (
//                     <div key={i} className="flex items-start gap-2">
//                       <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
//                       <span className="text-slate-700 dark:text-slate-300">{h}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Col: Booking Widget */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-dark-border sticky top-24">
//             <div className="text-center mb-6 border-b border-slate-100 dark:border-dark-border pb-6">
//               <p className="text-slate-500 uppercase text-sm font-bold tracking-wider mb-2">Ticket Price From</p>
//               <div className="flex items-end justify-center gap-1">
//                 <span className="text-4xl font-black text-slate-900 dark:text-white">₹{trip.price}</span>
//                 <span className="text-slate-500 font-medium mb-1">/ person</span>
//               </div>
//             </div>

//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-500 dark:text-slate-400 font-medium">Flight Status</span>
//                 <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full font-bold uppercase text-xs flex items-center gap-1">
//                   {trip.isActive ? 'Active' : 'Closed'}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-500 dark:text-slate-400 font-medium">Departure Time</span>
//                 <span className="font-bold text-slate-900 dark:text-white">{trip.departureTime}</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-500 dark:text-slate-400 font-medium">Arrival Time</span>
//                 <span className="font-bold text-slate-900 dark:text-white">{trip.arrivalTime}</span>
//               </div>
//             </div>

//             <button 
//               onClick={handleBookNow}
//               disabled={!trip.isActive || trip.availableSeats < 1}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.97] animate-fade-in"
//             >
//                BOOK FLIGHT NOW <Plane className="h-6 w-6" />
//             </button>
            
//             <p className="text-center text-xs text-slate-400 mt-4 italic">No hidden fees. Free cancellation within 24h.</p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default TripDetail;





import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Plane, Star, Clock, Info, CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await axios.get(`/trips/${id}`);
        setTrip(data);
      } catch (err) {
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="text-center text-red-500 text-xl font-semibold mt-10">{error}</div>;
  if (!trip) return <div className="text-center text-slate-500 text-xl mt-10">Trip not found.</div>;

  const images = trip.images && trip.images.length > 0 ? trip.images : ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"];

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/book/${trip._id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header & Breadcrumbs route can be added here if needed */}
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 dark:text-slate-400 transition-colors font-medium">
        <ChevronLeft className="h-5 w-5 mr-1" /> Back to result
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Gallery */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-dark-border">
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4 group">
              <img 
                src={images[activeImage].startsWith('/') ? `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${images[activeImage]}` : images[activeImage]} 
                alt={trip.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black p-2 rounded-full backdrop-blur transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-slate-900 dark:text-white" />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black p-2 rounded-full backdrop-blur transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-slate-900 dark:text-white" />
                  </button>
                </>
              )}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold uppercase text-xs tracking-wider shadow">
                {trip.category}
              </div>
            </div>
            
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`h-24 min-w-[120px] rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.startsWith('/') ? `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${img}` : img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Overview */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-dark-border">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{trip.name}</h1>
                <p className="flex items-center text-xl text-slate-500 font-medium italic">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" /> {trip.from} to {trip.location}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-400/10 dark:bg-yellow-400/5 px-6 py-3 rounded-2xl text-yellow-700 dark:text-yellow-500 border border-yellow-400/20 shadow-sm">
                <Star className="h-6 w-6 fill-current" />
                <span className="text-2xl font-black">{trip.rating}</span>
                <span className="text-sm font-bold uppercase tracking-wider">Excellent</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-[#f0f9ff] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-blue-100/50 dark:border-dark-border shadow-sm">
                <Plane className="h-7 w-7 text-blue-600 mb-3" />
                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Airline</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.airline}</span>
              </div>
              <div className="bg-[#f5f3ff] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-indigo-100/50 dark:border-dark-border shadow-sm">
                <Calendar className="h-7 w-7 text-indigo-600 mb-3" />
                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Dates</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">{new Date(trip.startDate).toLocaleDateString()} - <br/>{new Date(trip.endDate).toLocaleDateString()}</span>
              </div>
              <div className="bg-[#fff7ed] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-orange-100/50 dark:border-dark-border shadow-sm">
                <Clock className="h-7 w-7 text-orange-600 mb-3" />
                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Class</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.flightClass}</span>
              </div>
              <div className="bg-[#f0fdf4] dark:bg-slate-900/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center border border-green-100/50 dark:border-dark-border shadow-sm">
                <User className="h-7 w-7 text-green-600 mb-3" />
                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Availability</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-lg">{trip.availableSeats} Seats</span>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="flex items-center text-xl font-bold mb-4 text-slate-800"><Info className="h-5 w-5 mr-2 text-blue-500" /> About This Flight</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{trip.description}</p>
            </div>

            {trip.highlights && trip.highlights.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Trip Highlights</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {trip.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-blue-100 dark:border-dark-border sticky top-24">
            <div className="text-center mb-6 border-b border-slate-100 dark:border-dark-border pb-6">
              <p className="text-slate-500 uppercase text-sm font-bold tracking-wider mb-2">Ticket Price From</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₹{trip.price}</span>
                <span className="text-slate-500 font-medium mb-1">/ person</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Flight Status</span>
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full font-bold uppercase text-xs flex items-center gap-1">
                  {trip.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Departure Time</span>
                <span className="font-bold text-slate-900 dark:text-white">{trip.departureTime}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Arrival Time</span>
                <span className="font-bold text-slate-900 dark:text-white">{trip.arrivalTime}</span>
              </div>
            </div>

            <button 
              onClick={handleBookNow}
              disabled={!trip.isActive || trip.availableSeats < 1}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.97] animate-fade-in"
            >
               BOOK FLIGHT NOW <Plane className="h-6 w-6" />
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4 italic">No hidden fees. Free cancellation within 24h.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TripDetail;

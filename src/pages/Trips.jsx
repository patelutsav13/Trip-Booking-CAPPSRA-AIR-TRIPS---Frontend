// import { useState, useEffect } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import { MapPin, Search, Calendar, Plane, Star, ArrowRight, Filter } from 'lucide-react';

// const TripsPage = () => {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const [search, setSearch] = useState(searchParams.get('search') || '');
//   const [location, setLocation] = useState(searchParams.get('location') || '');
//   const [category, setCategory] = useState(searchParams.get('category') || '');

//   const fetchTrips = async () => {
//     setLoading(true);
//     try {
//       const query = new URLSearchParams();
//       if (search) query.append('search', search);
//       if (location) query.append('location', location);
//       if (category) query.append('category', category);
      
//       const { data } = await axios.get(`/trips?${query.toString()}`);
//       setTrips(data);
//       setSearchParams(query);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       fetchTrips();
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, location, category]);

//   const handleFilterSubmit = (e) => {
//     e.preventDefault();
//     fetchTrips();
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
//       {/* Header and Filter Section */}
//       <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Explore Worldwide Flights</h1>
        
//         <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//             <input 
//               type="text" 
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search destination, airline..." 
//               className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
//             />
//           </div>
//           <div className="relative">
//             <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//             <input 
//               type="text" 
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               placeholder="Country or City..." 
//               className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
//             />
//           </div>
//           <div className="relative cursor-pointer">
//             <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//             <select 
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all appearance-none font-medium"
//             >
//               <option value="">All Categories</option>
//               <option value="International">International</option>
//               <option value="Domestic">Domestic</option>
//             </select>
//           </div>
//           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
//             Apply Filters
//           </button>
//         </form>
//       </div>

//       {/* Trips Grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {[1,2,3,4,5,6,7,8].map(i => (
//             <div key={i} className="h-[400px] bg-white dark:bg-dark-card rounded-2xl animate-pulse"></div>
//           ))}
//         </div>
//       ) : trips.length === 0 ? (
//         <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
//           <Plane className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
//           <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No flights found</h3>
//           <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria and filters.</p>
//           <button onClick={() => {setSearch(''); setLocation(''); setCategory(''); fetchTrips();}} className="mt-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-100 transition-all uppercase tracking-widest text-xs">
//             Clear all filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
//           {trips.map(trip => (
//             <Link to={`/trip/${trip._id}`} key={trip._id} className="group bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-dark-border transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] flex flex-col">
//               <div className="relative h-48 overflow-hidden">
//                 <img 
//                   src={trip.images && trip.images[0] ? `http://localhost:5000${trip.images[0]}` : "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"} 
//                   alt={trip.name} 
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-sm font-semibold dark:text-white shadow-sm">
//                   <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {trip.rating}
//                 </div>
//               </div>
//               <div className="p-5 flex-1 flex flex-col">
//                 <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-black mb-3 uppercase tracking-[0.2em]">
//                   {trip.category}
//                 </div>
//                 <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{trip.name}</h3>
//                 <p className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-semibold mb-6">
//                   <MapPin className="h-3.5 w-3.5 mr-1" /> {trip.from} to {trip.location}
//                 </p>
                
//                 <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100/50 dark:border-dark-border">
//                   <span className="flex flex-col items-center gap-1">
//                     <Plane className="h-4 w-4 text-indigo-500" />
//                     <span className="max-w-[70px] truncate text-center text-[10px] uppercase tracking-wider" title={trip.airline}>{trip.airline}</span>
//                   </span>
//                   <span className="flex flex-col items-center border-l border-slate-200 dark:border-slate-800 pl-4 gap-1">
//                     <Calendar className="h-4 w-4 text-blue-500" />
//                     <span className="text-[10px]">{new Date(trip.startDate).toLocaleDateString()}</span>
//                   </span>
//                 </div>
                
//                 <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100/50 dark:border-dark-border">
//                   <div>
//                     <p className="text-2xl font-black text-slate-900 dark:text-white">₹{trip.price}</p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{trip.availableSeats} LEFT</p>
//                   </div>
//                   <button className="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
//                     Book <ArrowRight className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TripsPage;





import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Search, Calendar, Plane, Star, ArrowRight, Filter } from 'lucide-react';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (location) query.append('location', location);
      if (category) query.append('category', category);
      
      const { data } = await axios.get(`/trips?${query.toString()}`);
      setTrips(data);
      setSearchParams(query);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTrips();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, category]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header and Filter Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-border">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Explore Worldwide Flights</h1>
        
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, airline..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Country or City..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
            />
          </div>
          <div className="relative cursor-pointer">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-[#0f172a] border-2 border-slate-100 dark:border-dark-border rounded-2xl text-slate-900 dark:text-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all appearance-none font-medium"
            >
              <option value="">All Categories</option>
              <option value="International">International</option>
              <option value="Domestic">Domestic</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-[400px] bg-white dark:bg-dark-card rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-dark-border">
          <Plane className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No flights found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria and filters.</p>
          <button onClick={() => {setSearch(''); setLocation(''); setCategory(''); fetchTrips();}} className="mt-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-100 transition-all uppercase tracking-widest text-xs">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {trips.map(trip => (
            <Link to={`/trip/${trip._id}`} key={trip._id} className="group bg-white dark:bg-dark-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-dark-border transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.images && trip.images[0] ? `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${trip.images[0]}` : "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"} 
                  alt={trip.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-sm font-semibold dark:text-white shadow-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {trip.rating}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-black mb-3 uppercase tracking-[0.2em]">
                  {trip.category}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{trip.name}</h3>
                <p className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-semibold mb-6">
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {trip.from} to {trip.location}
                </p>
                
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100/50 dark:border-dark-border">
                  <span className="flex flex-col items-center gap-1">
                    <Plane className="h-4 w-4 text-indigo-500" />
                    <span className="max-w-[70px] truncate text-center text-[10px] uppercase tracking-wider" title={trip.airline}>{trip.airline}</span>
                  </span>
                  <span className="flex flex-col items-center border-l border-slate-200 dark:border-slate-800 pl-4 gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-[10px]">{new Date(trip.startDate).toLocaleDateString()}</span>
                  </span>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100/50 dark:border-dark-border">
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹{trip.price}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{trip.availableSeats} LEFT</p>
                  </div>
                  <button className="bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                    Book <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPage;

// // import { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import { MapPin, Search, Calendar, Plane, Star } from 'lucide-react';

// // const Home = () => {
// //   const [featuredTrips, setFeaturedTrips] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [locationObj, setLocationObj] = useState('');
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchTrips = async () => {
// //       try {
// //         const { data } = await axios.get('/trips');
// //         // Get 6 random or top trips for featured section
// //         setFeaturedTrips(data.slice(0, 6));
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTrips();
// //   }, []);

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     const query = new URLSearchParams();
// //     if (searchQuery) query.append('search', searchQuery);
// //     if (locationObj) query.append('location', locationObj);
// //     navigate(`/trips?${query.toString()}`);
// //   };

// //   return (
// //     <div className="space-y-16 pb-16">
// //       {/* Hero Section */}
// //       <section className="relative rounded-3xl overflow-hidden h-[500px] sm:h-[600px] flex items-center justify-center">
// //         <div className="absolute inset-0 z-0">
// //           <img 
// //             src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
// //             alt="Aircraft in sky" 
// //             className="w-full h-full object-cover"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
// //         </div>
        
// //         <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-[-50px]">
// //           <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 backdrop-blur-md mb-6 text-xs font-bold tracking-widest uppercase animate-fade-in border border-blue-200/20">
// //             EXPLORE THE WORLD
// //           </span>
// //           <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] drop-shadow-2xl">
// //             Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Dream Destination</span>
// //           </h1>
// //           <p className="text-xl text-slate-100/90 mb-12 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
// //             Book flights to over 100+ locations worldwide. Exclusive deals, premium seating, and unforgettable experiences await.
// //           </p>

// //           {/* Search Bar */}
// //           <div className="bg-white dark:bg-dark-card p-2 sm:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto backdrop-blur-xl bg-opacity-95 dark:bg-opacity-90">
// //             <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
// //               <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
// //                 <Search className="absolute left-4 text-slate-400 h-5 w-5" />
// //                 <input 
// //                   type="text" 
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                   placeholder="Where are you going?" 
// //                   className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
// //                 />
// //               </div>
// //               <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
// //                 <MapPin className="absolute left-4 text-slate-400 h-5 w-5" />
// //                 <input 
// //                   type="text" 
// //                   value={locationObj}
// //                   onChange={(e) => setLocationObj(e.target.value)}
// //                   placeholder="Location (e.g., Japan)" 
// //                   className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
// //                 />
// //               </div>
// //               <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors sm:w-auto w-full">
// //                 Search
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Featured Destinations */}
// //       <section className="max-w-7xl mx-auto">
// //         <div className="flex justify-between items-end mb-8">
// //           <div>
// //             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Destinations</h2>
// //             <p className="text-slate-500 dark:text-slate-400">Discover our most booked flights this month.</p>
// //           </div>
// //           <Link to="/trips" className="text-blue-600 hover:text-blue-700 font-medium hidden sm:flex items-center gap-1">
// //             View All <ArrowRight className="h-4 w-4" />
// //           </Link>
// //         </div>

// //         {loading ? (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {[1,2,3,4,5,6].map(i => (
// //               <div key={i} className="h-[400px] bg-slate-200 dark:bg-dark-card rounded-2xl animate-pulse"></div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
// //             {featuredTrips.map(trip => (
// //               <Link to={`/trip/${trip._id}`} key={trip._id} className="group bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-dark-border transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col">
// //                 <div className="relative h-56 overflow-hidden">
// //                   <img 
// //                     src={trip.images && trip.images[0] ? `http://localhost:5000${trip.images[0]}` : "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"} 
// //                     alt={trip.name} 
// //                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
// //                   />
// //                   <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold dark:text-white">
// //                     <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {trip.rating}
// //                   </div>
// //                   <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
// //                     {trip.category}
// //                   </div>
// //                 </div>
// //                 <div className="p-5 flex-1 flex flex-col">
// //                   <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2 gap-1">
// //                     <MapPin className="h-4 w-4" /> {trip.location}
// //                   </div>
// //                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{trip.name}</h3>
// //                   <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-dark-border/50 pb-6">
// //                     <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Plane className="h-4 w-4" /> {trip.airline}</span>
// //                     <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
// //                   </div>
// //                   <div className="mt-auto flex items-end justify-between">
// //                     <div>
// //                       <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Starting from</p>
// //                       <p className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{trip.price}</p>
// //                     </div>
// //                     <button className="bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-blue-700 dark:text-blue-300 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm group-hover:shadow-md">
// //                       View details
// //                     </button>
// //                   </div>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         )}
// //       </section>
// //     </div>
// //   );
// // };

// // // Helper for ArrowRight icon since it's used inline but wasn't in imports
// // const ArrowRight = ({ className }) => (
// //   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
// // );

// // export default Home;





// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MapPin, Search, Calendar, Plane, Star } from 'lucide-react';

// const Home = () => {
//   const [featuredTrips, setFeaturedTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [locationObj, setLocationObj] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const { data } = await axios.get('/trips');
//         // Get 6 random or top trips for featured section
//         setFeaturedTrips(data.slice(0, 6));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrips();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const query = new URLSearchParams();
//     if (searchQuery) query.append('search', searchQuery);
//     if (locationObj) query.append('location', locationObj);
//     navigate(`/trips?${query.toString()}`);
//   };

//   return (
//     <div className="space-y-16 pb-16">
//       {/* Hero Section */}
//       <section className="relative rounded-3xl overflow-hidden h-[500px] sm:h-[600px] flex items-center justify-center">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
//             alt="Aircraft in sky" 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
//         </div>
        
//         <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-[-50px]">
//           <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 backdrop-blur-md mb-6 text-xs font-bold tracking-widest uppercase animate-fade-in border border-blue-200/20">
//             EXPLORE THE WORLD
//           </span>
//           <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] drop-shadow-2xl">
//             Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Dream Destination</span>
//           </h1>
//           <p className="text-xl text-slate-100/90 mb-12 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
//             Book flights to over 100+ locations worldwide. Exclusive deals, premium seating, and unforgettable experiences await.
//           </p>

//           {/* Search Bar */}
//           <div className="bg-white dark:bg-dark-card p-2 sm:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto backdrop-blur-xl bg-opacity-95 dark:bg-opacity-90">
//             <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
//               <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
//                 <Search className="absolute left-4 text-slate-400 h-5 w-5" />
//                 <input 
//                   type="text" 
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Where are you going?" 
//                   className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
//                 <MapPin className="absolute left-4 text-slate-400 h-5 w-5" />
//                 <input 
//                   type="text" 
//                   value={locationObj}
//                   onChange={(e) => setLocationObj(e.target.value)}
//                   placeholder="Location (e.g., Japan)" 
//                   className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors sm:w-auto w-full">
//                 Search
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* Featured Destinations */}
//       <section className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-end mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Destinations</h2>
//             <p className="text-slate-500 dark:text-slate-400">Discover our most booked flights this month.</p>
//           </div>
//           <Link to="/trips" className="text-blue-600 hover:text-blue-700 font-medium hidden sm:flex items-center gap-1">
//             View All <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[1,2,3,4,5,6].map(i => (
//               <div key={i} className="h-[400px] bg-slate-200 dark:bg-dark-card rounded-2xl animate-pulse"></div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//             {featuredTrips.map(trip => (
//               <Link to={`/trip/${trip._id}`} key={trip._id} className="group bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-dark-border transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col">
//                 <div className="relative h-56 overflow-hidden">
//                   <img 
//                     src={trip.images && trip.images[0] ? `${import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000'}${trip.images[0]}` : "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"} 
//                     alt={trip.name} 
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold dark:text-white">
//                     <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {trip.rating}
//                   </div>
//                   <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
//                     {trip.category}
//                   </div>
//                 </div>
//                 <div className="p-5 flex-1 flex flex-col">
//                   <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2 gap-1">
//                     <MapPin className="h-4 w-4" /> {trip.location}
//                   </div>
//                   <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{trip.name}</h3>
//                   <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-dark-border/50 pb-6">
//                     <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Plane className="h-4 w-4" /> {trip.airline}</span>
//                     <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
//                   </div>
//                   <div className="mt-auto flex items-end justify-between">
//                     <div>
//                       <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Starting from</p>
//                       <p className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{trip.price}</p>
//                     </div>
//                     <button className="bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-blue-700 dark:text-blue-300 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm group-hover:shadow-md">
//                       View details
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// // Helper for ArrowRight icon since it's used inline but wasn't in imports
// const ArrowRight = ({ className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
// );

// export default Home;



import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Search, Calendar, Plane, Star } from 'lucide-react';

const Home = () => {
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationObj, setLocationObj] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axios.get('/trips');
        // Get 6 random or top trips for featured section
        setFeaturedTrips(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchQuery) query.append('search', searchQuery);
    if (locationObj) query.append('location', locationObj);
    navigate(`/trips?${query.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden h-[500px] sm:h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
            alt="Aircraft in sky" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-[-50px]">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 backdrop-blur-md mb-6 text-xs font-bold tracking-widest uppercase animate-fade-in border border-blue-200/20">
            EXPLORE THE WORLD
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] drop-shadow-2xl">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Dream Destination</span>
          </h1>
          <p className="text-xl text-slate-100/90 mb-12 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
            Book flights to over 100+ locations worldwide. Exclusive deals, premium seating, and unforgettable experiences await.
          </p>

          {/* Search Bar */}
          <div className="bg-white dark:bg-dark-card p-2 sm:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto backdrop-blur-xl bg-opacity-95 dark:bg-opacity-90">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
                <Search className="absolute left-4 text-slate-400 h-5 w-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where are you going?" 
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-[#0f172a] rounded-xl overflow-hidden">
                <MapPin className="absolute left-4 text-slate-400 h-5 w-5" />
                <input 
                  type="text" 
                  value={locationObj}
                  onChange={(e) => setLocationObj(e.target.value)}
                  placeholder="Location (e.g., Japan)" 
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors sm:w-auto w-full">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Destinations</h2>
            <p className="text-slate-500 dark:text-slate-400">Discover our most booked flights this month.</p>
          </div>
          <Link to="/trips" className="text-blue-600 hover:text-blue-700 font-medium hidden sm:flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] bg-slate-200 dark:bg-dark-card rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredTrips.map(trip => (
              <Link to={`/trip/${trip._id}`} key={trip._id} className="group bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-dark-border transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={trip.images && trip.images[0] ? `${(import.meta.env.VITE_IMAGE_URL || 'http://localhost:5000').replace(/\/$/, '')}${trip.images[0]}` : "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074"} 
                    alt={trip.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold dark:text-white">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {trip.rating}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
                    {trip.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2 gap-1">
                    <MapPin className="h-4 w-4" /> {trip.location}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{trip.name}</h3>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-dark-border/50 pb-6">
                    <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Plane className="h-4 w-4" /> {trip.airline}</span>
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">Starting from</p>
                      <p className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{trip.price}</p>
                    </div>
                    <button className="bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-blue-700 dark:text-blue-300 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm group-hover:shadow-md">
                      View details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Helper for ArrowRight icon since it's used inline but wasn't in imports
const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default Home;

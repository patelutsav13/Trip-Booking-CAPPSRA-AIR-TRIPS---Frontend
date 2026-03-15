import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TripsPage from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import Coupons from './pages/Coupons';
import DigitalTicket from './pages/DigitalTicket';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTrips from './pages/admin/AdminTrips';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBookings from './pages/admin/AdminBookings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trip/:id" element={<TripDetail />} />
              
              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/book/:id" element={<Booking />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/ticket/:id" element={<DigitalTicket />} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/trips" element={<AdminTrips />} />
                <Route path="/admin/coupons" element={<AdminCoupons />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

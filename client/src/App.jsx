import { Routes, Route, Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from './context/LocationContext';
import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import MoviesPage from './pages/Movies';
import EventsPage from './pages/Events';
import RestaurantsPage from './pages/Restaurants';
import StoresPage from './pages/Stores';
import ActivitiesPage from './pages/Activities';
import MovieDetail from './pages/MovieDetail';
import EventDetail from './pages/EventDetail';
import RestaurantDetail from './pages/RestaurantDetail';
import StoreDetail from './pages/StoreDetail';
import ActivityDetail from './pages/ActivityDetail';
import SeatBooking from './pages/SeatBooking';
import BookingSuccess from './pages/BookingSuccess';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import LocationModal from './components/LocationModal';
import SearchBar from './components/SearchBar';
import SmoothScroll from './components/SmoothScroll';
import { SignInPage, SignUpPage } from './pages/Auth';
import Loader from './components/Loader';
import Footer from './components/Footer';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { syncUser } from './api';
import { MapPin, Search, Menu, X } from 'lucide-react';

function App() {
  const { selectedCity, updateCity } = useLocation();
  const { user, isLoaded } = useUser();
  const routerLocation = useRouterLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial and Route Change Loader
  useEffect(() => {
    Promise.resolve().then(() => setLoading(true));
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [routerLocation.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      const handleSync = async () => {
        try {
          await syncUser({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName
          });
        } catch (err) {
          console.error("User Sync Failed", err);
        }
      };
      handleSync();
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      <LocationModal />

      {/* Enhanced Navbar */}
      <Motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${navScrolled
          ? 'bg-white/70 shadow-lg shadow-black/5'
          : 'bg-white/40'
          } backdrop-blur-xl border-b border-gray-100/50`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo */}
          <Motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="relative group">
              <span className="text-brand-600 font-black text-2xl tracking-tighter bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                BlockBuster
              </span>
              <Motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-600 to-purple-600"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              ></Motion.div>
            </Link>
          </Motion.div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* City Selector */}
            <Motion.button
              onClick={() => updateCity(null)}
              className="group hidden sm:flex items-center gap-2 text-gray-700 hover:text-brand-600 text-sm font-semibold transition-colors relative"
              whileHover={{ x: 4 }}
            >
              <Motion.div
                className="p-2 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <MapPin size={16} />
              </Motion.div>
              <span className="hidden md:inline">{selectedCity ? selectedCity.name : 'Select City'}</span>
              <Motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="group-hover:rotate-180 transition-transform"
              >
                <path d="m6 9 6 6 6-6" />
              </Motion.svg>
            </Motion.button>

            {/* Mobile Search Toggle */}
            <Motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} className="text-gray-700" />
            </Motion.button>

            {/* Auth Buttons */}
            <SignedOut>
              <Motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/sign-in" className="relative group inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg text-sm font-bold overflow-hidden shadow-lg shadow-brand-500/20">
                  <span className="relative z-10">Sign In</span>
                  <Motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  ></Motion.div>
                </Link>
              </Motion.div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 md:gap-4">
                <Motion.span
                  className="text-sm font-semibold text-gray-700 hidden md:inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Hi, {user?.firstName}
                </Motion.span>
                <Motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserButton afterSignOutUrl="/" />
                </Motion.div>
              </div>
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <Motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </Motion.div>
            </Motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden ${mobileMenuOpen ? 'overflow-visible' : 'overflow-hidden'} border-t border-gray-100/50 bg-white/50 backdrop-blur-xl`}
        >
          <div className="px-4 py-4 space-y-3">
            <div className="pb-3 border-b border-gray-100">
              <SearchBar />
            </div>
            <Motion.button
              onClick={() => updateCity(null)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-brand-700 font-semibold"
              whileHover={{ x: 6 }}
            >
              <MapPin size={18} />
              {selectedCity ? selectedCity.name : 'Select City'}
            </Motion.button>
          </div>
        </Motion.div>
      </Motion.nav>

      <main className="flex-grow">
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/movies/:id/booking" element={<SeatBooking />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/stores/:id" element={<StoreDetail />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScroll>
      </main>

      <Footer />
    </div>
  );
}

export default App;

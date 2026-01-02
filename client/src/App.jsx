import { Routes, Route, Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from './context/LocationContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import ScrollToTop from './components/ScrollToTop';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { syncUser } from './api';
import { MapPin, Search, Menu, X, Facebook, Twitter, Instagram, Linkedin, Ticket, Utensils, ShoppingBag as ShoppingIcon, Zap } from 'lucide-react';

function App() {
  const { selectedCity, updateCity } = useLocation();
  const { user, isLoaded } = useUser();
  const routerLocation = useRouterLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

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

  const isAuthPage = routerLocation.pathname.includes('sign-in') || routerLocation.pathname.includes('sign-up');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      <LocationModal />

      {/* Enhanced Navbar */}
      <motion.nav
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="relative group">
              <span className="text-brand-600 font-black text-2xl tracking-tighter bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                BlockBuster
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-600 to-purple-600"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* City Selector */}
            <motion.button
              onClick={() => updateCity(null)}
              className="group hidden sm:flex items-center gap-2 text-gray-700 hover:text-brand-600 text-sm font-semibold transition-colors relative"
              whileHover={{ x: 4 }}
            >
              <motion.div
                className="p-2 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <MapPin size={16} />
              </motion.div>
              <span className="hidden md:inline">{selectedCity ? selectedCity.name : 'Select City'}</span>
              <motion.svg
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
              </motion.svg>
            </motion.button>

            {/* Mobile Search Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} className="text-gray-700" />
            </motion.button>

            {/* Auth Buttons */}
            <SignedOut>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/sign-in" className="relative group inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg text-sm font-bold overflow-hidden shadow-lg shadow-brand-500/20">
                  <span className="relative z-10">Sign In</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </Link>
              </motion.div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 md:gap-4">
                <motion.span
                  className="text-sm font-semibold text-gray-700 hidden md:inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Hi, {user?.firstName}
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <UserButton afterSignOutUrl="/" />
                </motion.div>
              </div>
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
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
            <motion.button
              onClick={() => updateCity(null)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-brand-700 font-semibold"
              whileHover={{ x: 6 }}
            >
              <MapPin size={18} />
              {selectedCity ? selectedCity.name : 'Select City'}
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

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

      {/* Premium Animated Footer */}
      <motion.footer
        className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          ></motion.div>
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          ></motion.div>
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 pt-20 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
              {/* Branding */}
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.h2
                  className="text-4xl font-black bg-gradient-to-r from-white via-brand-300 to-brand-500 bg-clip-text text-transparent mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  BlockBuster
                </motion.h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Discover the extraordinary. Your premium gateway to the city's finest entertainment, dining, and adventures awaits.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: <Ticket size={18} />, label: 'Movies' },
                    { icon: <Zap size={18} />, label: 'Events' },
                    { icon: <Utensils size={18} />, label: 'Dining' },
                    { icon: <ShoppingIcon size={18} />, label: 'Stores' }
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-brand-400"
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                  Categories
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Movies', path: '/movies' },
                    { name: 'Events', path: '/events' },
                    { name: 'Restaurants', path: '/restaurants' },
                    { name: 'Stores', path: '/stores' },
                    { name: 'Activities', path: '/activities' }
                  ].map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 6 }}>
                      <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                        {item.name}
                        <motion.span
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        ></motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                  Company
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'About Us', path: '/about' },
                    { name: 'Contact', path: '/contact' },
                    { name: 'FAQ', path: '/faq' }
                  ].map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 6 }}>
                      <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                        {item.name}
                        <motion.span
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        ></motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Privacy Policy', path: '/privacy' },
                    { name: 'Terms of Service', path: '/terms' }
                  ].map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 6 }}>
                      <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                        {item.name}
                        <motion.span
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        ></motion.span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Divider */}
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent mb-12"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            ></motion.div>

            {/* Bottom Section */}
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-gray-500 text-sm">
                © 2024 BlockBuster Entertainment. Crafted with passion for amazing experiences.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { name: 'Twitter', icon: <Twitter size={18} /> },
                  { name: 'Instagram', icon: <Instagram size={18} /> },
                  { name: 'LinkedIn', icon: <Linkedin size={18} /> },
                  { name: 'Facebook', icon: <Facebook size={18} /> }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    whileHover={{ scale: 1.2, y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;

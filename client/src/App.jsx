import { Routes, Route, Link } from 'react-router-dom';
import { useLocation } from './context/LocationContext';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Home from './pages/Home';
import MoviesPage from './pages/Movies';
import EventsPage from './pages/Events';
import RestaurantsPage from './pages/Restaurants';
import StoresPage from './pages/Stores';
import ActivitiesPage from './pages/Activities';
import MovieDetail from './pages/MovieDetail';
import EventDetail from './pages/EventDetail';
import SeatBooking from './pages/SeatBooking';
import BookingSuccess from './pages/BookingSuccess';
import LocationModal from './components/LocationModal';
import { SignInPage, SignUpPage } from './pages/Auth';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import axios from 'axios';

function App() {
  const { selectedCity, updateCity } = useLocation();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Sync User with Backend
  useEffect(() => {
    if (isLoaded && user) {
      const syncUser = async () => {
        try {
          await axios.post('http://localhost:5000/api/users/sync', {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName
          });
        } catch (err) {
          console.error("User Sync Failed", err);
        }
      };
      syncUser();
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LocationModal />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-brand-600 font-extrabold text-2xl tracking-tighter">BlockBuster</Link>

            {/* Search Bar Placeholder */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="w-[300px] lg:w-[400px] border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* City Selector Trigger */}
            <button
              onClick={() => updateCity(null)}
              className="flex items-center gap-1 text-gray-700 hover:text-brand-600 text-sm font-medium transition-colors"
            >
              {selectedCity ? selectedCity.name : 'Select City'}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>

            <SignedOut>
              <Link to="/sign-in" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-1.5 rounded-md text-sm font-semibold transition-colors">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                  Hi, {user?.firstName}
                </span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/movies/:id/booking" element={<SeatBooking />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/booking/success" element={<BookingSuccess />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">BlockBuster</h2>
          <div className="flex justify-center gap-6 mb-8 text-gray-400">
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
          <p className="text-gray-500">© 2024 BlockBuster Entertainment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

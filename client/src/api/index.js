import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    return config;
});

export const fetchCities = () => api.get('/cities');
export const fetchVenues = (citySlug) => api.get(`/venues?city=${citySlug}`);

// Movies
export const fetchMovies = (citySlug) => api.get(`/movies?city=${citySlug}`);
export const fetchMovieById = (id) => api.get(`/movies/${id}`);

// Events
export const fetchEvents = (citySlug, type) => api.get(`/events?city=${citySlug}&type=${type || ''}`);
export const fetchEventById = (id) => api.get(`/events/${id}`);

// Restaurants
export const fetchRestaurants = (citySlug, cuisine) => api.get(`/restaurants?city=${citySlug}&cuisine=${cuisine || ''}`);
export const fetchRestaurantById = (id) => api.get(`/restaurants/${id}`);

// Stores
export const fetchStores = (citySlug, category) => api.get(`/stores?city=${citySlug}&category=${category || ''}`);
export const fetchStoreById = (id) => api.get(`/stores/${id}`);

// Activities
export const fetchActivities = (citySlug, type) => api.get(`/activities?city=${citySlug}&type=${type || ''}`);
export const fetchActivityById = (id) => api.get(`/activities/${id}`);

// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const verifyPayment = (paymentData) => api.post('/bookings/verify-payment', paymentData);
export const getUserBookings = (userId) => api.get(`/bookings/user/${userId}`);

// Search
export const globalSearch = (query, city) => api.get(`/search?q=${query}&city=${city || ''}`);

export default api;

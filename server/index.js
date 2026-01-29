require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import Routes
const cityRoutes = require('./routes/cities');
const venueRoutes = require('./routes/venues');
const movieRoutes = require('./routes/movies');
const eventRoutes = require('./routes/events');
const restaurantRoutes = require('./routes/restaurants');
const storeRoutes = require('./routes/stores');
const activityRoutes = require('./routes/activities');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const searchRoutes = require('./routes/search');
const screeningRoutes = require('./routes/screenings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'https://block-buster-tau.vercel.app'],
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
connectDB();

// Routes
app.use('/api/cities', cityRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/screenings', screeningRoutes);

app.get('/', (req, res) => {
    res.send('BlockBuster API is running...');
});

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

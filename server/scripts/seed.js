const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('../models/City');
const Movie = require('../models/Movie');
const Event = require('../models/Event');
const Restaurant = require('../models/Restaurant');
const Store = require('../models/Store');
const Activity = require('../models/Activity');

dotenv.config();

const cities = [
    {
        name: 'Hyderabad',
        slug: 'hyderabad',
        image: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&q=80&w=400',
        lat: 17.3850,
        lng: 78.4867
    },
    {
        name: 'Bengaluru',
        slug: 'bengaluru',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400',
        lat: 12.9716,
        lng: 77.5946
    },
    {
        name: 'Mumbai',
        slug: 'mumbai',
        image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2cb7?auto=format&fit=crop&q=80&w=400',
        lat: 19.0760,
        lng: 72.8774
    },
    {
        name: 'Chennai',
        slug: 'chennai',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=400',
        lat: 13.0827,
        lng: 80.2707
    },
    {
        name: 'Delhi',
        slug: 'delhi',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=400',
        lat: 28.6139,
        lng: 77.2090
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await City.deleteMany();
        console.log('Cleared existing cities.');

        // Insert new cities
        await City.insertMany(cities);
        console.log('Successfully seeded cities!');

        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();

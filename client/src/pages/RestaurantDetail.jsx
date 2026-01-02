import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from '../context/LocationContext';
import { fetchRestaurantById, createBooking, verifyPayment } from '../api';
import { MapPin, Phone, Clock, DollarSign, Utensils, Star, ExternalLink, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { selectedCity } = useLocation();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [guests, setGuests] = useState(2);
    const [initialCity, setInitialCity] = useState(null);

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const { data } = await fetchRestaurantById(id);
                setRestaurant(data);
                if (!initialCity && data.city) {
                    setInitialCity(data.city.slug);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getRestaurant();
    }, [id]);

    // Navigate to home when city changes
    useEffect(() => {
        if (initialCity && selectedCity && selectedCity.slug !== initialCity) {
            navigate('/');
        }
    }, [selectedCity, initialCity, navigate]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleReservation = async () => {
        if (!user) {
            alert('Please sign in to make a reservation');
            navigate('/sign-in');
            return;
        }

        const reservationFee = 100; // Per person booking fee
        setProcessing(true);

        try {
            const { data } = await createBooking({
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                entityId: restaurant._id,
                entityType: 'Restaurant',
                venueId: restaurant.venue?._id,
                quantity: guests,
                totalAmount: guests * reservationFee
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'BlockBuster',
                description: `Reservation: ${restaurant.title}`,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: data.booking._id
                        });
                        navigate('/booking/success');
                    } catch (err) {
                        alert('Payment verification failed');
                        console.error(err);
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || ''
                },
                theme: {
                    color: '#ef4444'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to initiate payment');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center"
            >
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-brand-600 text-3xl font-bold">
                    Loading...
                </motion.div>
            </motion.div>
        );
    }
    if (!restaurant) return <div className="p-10 text-center">Restaurant not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.img
                        src={restaurant.image || 'https://via.placeholder.com/600x400'}
                        alt={restaurant.title}
                        className="w-full rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                    />
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-orange-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {restaurant.title}
                    </motion.h1>

                    {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="p-2 bg-brand-100 rounded-lg">
                                <Utensils size={20} className="text-brand-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{restaurant.cuisine.join(', ')}</span>
                        </motion.div>
                    )}

                    {restaurant.description && (
                        <p className="text-gray-600 mb-6">{restaurant.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
                        {restaurant.venue && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin size={20} className="text-brand-500" />
                                <span>{restaurant.venue.name}{restaurant.city && `, ${restaurant.city.name}`}</span>
                            </div>
                        )}

                        {restaurant.contactNumber && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={20} className="text-brand-500" />
                                <span>{restaurant.contactNumber}</span>
                            </div>
                        )}

                        {restaurant.operatingHours && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={20} className="text-brand-500" />
                                <span>{restaurant.operatingHours}</span>
                            </div>
                        )}

                        {restaurant.priceRange && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign size={20} className="text-brand-500" />
                                <span>Price Range: {restaurant.priceRange}</span>
                            </div>
                        )}

                        {restaurant.rating > 0 && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Star size={20} className="text-brand-500" fill="currentColor" />
                                <span>{restaurant.rating}/5</span>
                            </div>
                        )}

                        {restaurant.menu && (
                            <div className="flex items-center gap-2">
                                <ExternalLink size={20} className="text-brand-500" />
                                <a href={restaurant.menu} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                                    View Menu
                                </a>
                            </div>
                        )}
                    </div>

                    {restaurant.tags && restaurant.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {restaurant.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Reservation */}
                    <motion.div
                        className="bg-gradient-to-br from-brand-50 to-orange-50 rounded-2xl p-8 border border-brand-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-brand-600 to-orange-600 bg-clip-text text-transparent">Make a Reservation</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-700 font-medium">Number of Guests:</span>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-10 h-10 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center text-brand-600 font-bold"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Minus size={18} />
                                </motion.button>
                                <motion.span
                                    className="font-bold text-2xl w-10 text-center text-brand-600"
                                    key={guests}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                >
                                    {guests}
                                </motion.span>
                                <motion.button
                                    onClick={() => setGuests(guests + 1)}
                                    className="w-10 h-10 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center text-brand-600 font-bold"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Plus size={18} />
                                </motion.button>
                            </div>
                        </div>
                        <motion.div
                            className="flex justify-between items-center mb-6 pb-6 border-b-2 border-brand-200"
                            layout
                        >
                            <span className="text-gray-700 font-medium">Booking Fee (₹100 per person):</span>
                            <motion.span
                                className="font-black text-xl text-brand-600"
                                key={guests}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                ₹{guests * 100}
                            </motion.span>
                        </motion.div>
                        <motion.button
                            onClick={handleReservation}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/30"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {processing ? 'Processing...' : 'Reserve Table'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RestaurantDetail;

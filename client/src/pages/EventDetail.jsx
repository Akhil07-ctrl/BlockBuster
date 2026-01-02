import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from '../context/LocationContext';
import { fetchEventById, createBooking, verifyPayment } from '../api';
import { Calendar, MapPin, Minus, Plus, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { selectedCity } = useLocation();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [initialCity, setInitialCity] = useState(null);

    useEffect(() => {
        const getEvent = async () => {
            try {
                const { data } = await fetchEventById(id);
                setEvent(data);
                if (!initialCity && data.city) {
                    setInitialCity(data.city.slug);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getEvent();
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

    const handleBooking = async () => {
        if (!user) {
            alert('Please sign in to book tickets');
            navigate('/sign-in');
            return;
        }

        setProcessing(true);

        try {
            const { data } = await createBooking({
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                entityId: event._id,
                entityType: 'Event',
                venueId: event.venue._id,
                date: event.date,
                quantity,
                totalAmount: quantity * event.price
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'BlockBuster',
                description: `Event: ${event.title}`,
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

    if (!event) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center"
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-brand-600 text-3xl font-bold"
                >
                    Loading event...
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Event Image */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.img
                        src={event.image || 'https://via.placeholder.com/600x400'}
                        alt={event.title}
                        className="w-full rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                    />
                </motion.div>

                {/* Event Details */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {event.title}
                    </motion.h1>

                    {/* Event Type */}
                    {event.type && (
                        <motion.span
                            className="inline-block bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg shadow-brand-500/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {event.type}
                        </motion.span>
                    )}

                    {event.description && (
                        <motion.p
                            className="text-gray-600 mb-8 text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {event.description}
                        </motion.p>
                    )}

                    <motion.div
                        className="space-y-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {event.date && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Calendar size={20} className="text-brand-500" />
                                <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        )}

                        {event.venue && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin size={20} className="text-brand-500" />
                                <span>{event.venue.name}{event.city && `, ${event.city.name}`}</span>
                            </div>
                        )}

                        {event.artist && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <User size={20} className="text-brand-500" />
                                <span>Artist: {event.artist}</span>
                            </div>
                        )}

                        {event.organizer && (
                            <div className="text-sm text-gray-600">
                                Organized by: {event.organizer}
                            </div>
                        )}

                        {event.tags && event.tags.length > 0 && (
                            <div className="flex items-start gap-2">
                                <Tag size={20} className="text-brand-500 mt-1" />
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Booking Section */}
                    <motion.div
                        className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-8 border border-brand-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Book Tickets</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center gap-3">
                                <motion.button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-100 to-purple-100 hover:from-brand-200 hover:to-purple-200 flex items-center justify-center text-brand-600 font-bold transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Minus size={18} />
                                </motion.button>
                                <motion.span
                                    className="font-bold text-2xl w-10 text-center text-brand-600"
                                    key={quantity}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                >
                                    {quantity}
                                </motion.span>
                                <motion.button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-100 to-purple-100 hover:from-brand-200 hover:to-purple-200 flex items-center justify-center text-brand-600 font-bold transition-all"
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
                            <span className="text-gray-700 font-medium">Total:</span>
                            <motion.span
                                className="font-black text-2xl bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                                key={quantity}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                ₹{quantity * event.price}
                            </motion.span>
                        </motion.div>
                        <motion.button
                            onClick={handleBooking}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/30"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {processing ? 'Processing...' : 'Proceed to Payment'}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventDetail;

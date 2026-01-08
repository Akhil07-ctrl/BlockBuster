import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from '../context/LocationContext';
import { fetchEventById, createBooking, verifyPayment } from '../api';
import { Calendar, MapPin, Minus, Plus, User, Tag, Heart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { selectedCity } = useLocation();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [initialCity, setInitialCity] = useState(null);

    const { isWishlisted, toggle, message: wishlistMessage } = useWishlist(id, 'Event');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
            full: date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    };

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
    }, [id, initialCity]);

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
                        const verifyRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: data.booking._id
                        });
                        navigate('/booking/success', {
                            state: {
                                booking: verifyRes.data.booking,
                                movie: null // Not a movie booking
                            }
                        });
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
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center"
            >
                <Motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-brand-600 text-3xl font-bold"
                >
                    Loading event...
                </Motion.div>
            </Motion.div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Event Image */}
                <Motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Motion.img
                        src={event.image || 'https://placehold.co/600x400'}
                        alt={event.title}
                        className="w-full rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                    />
                </Motion.div>

                {/* Event Details */}
                <Motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Motion.h1
                        className="text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {event.title}
                    </Motion.h1>

                    {/* Event Type & Wishlist */}
                    <div className="flex items-center gap-4 mb-6 relative">
                        {event.type && (
                            <Motion.span
                                className="inline-block bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-brand-500/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {event.type}
                            </Motion.span>
                        )}

                        <Motion.button
                            onClick={toggle}
                            className={`p-2 rounded-full transition-all border-2 ${isWishlisted ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-gray-200 text-gray-400 hover:border-brand-500 hover:text-brand-500'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={isWishlisted ? "Remove from Hotlist" : "Add to Hotlist"}
                        >
                            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                        </Motion.button>

                        <AnimatePresence>
                            {wishlistMessage && (
                                <Motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
                                >
                                    <div className="bg-gray-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-2xl font-bold shadow-2xl border border-white/10 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                                            <Heart size={16} fill="white" />
                                        </div>
                                        {wishlistMessage}
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {event.description && (
                        <Motion.p
                            className="text-gray-600 mb-8 text-lg leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {event.description}
                        </Motion.p>
                    )}

                    <Motion.div
                        className="space-y-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        {event.date && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                    <Calendar size={20} className="text-brand-500" />
                                    <span>Schedule</span>
                                </div>
                                <div className="flex items-center gap-5 bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm w-fit group hover:shadow-md transition-all duration-300">
                                    {(() => {
                                        const dateInfo = formatDate(event.date);
                                        return (
                                            <>
                                                <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-80">
                                                        {dateInfo.day}
                                                    </span>
                                                    <span className="text-2xl font-black leading-none my-1">
                                                        {dateInfo.date}
                                                    </span>
                                                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                                                        {dateInfo.month}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col pr-6">
                                                    <span className="text-gray-900 font-black text-xl leading-tight">
                                                        {dateInfo.full.split(',')[0]}
                                                    </span>
                                                    <span className="text-gray-500 font-semibold tracking-tight">
                                                        {dateInfo.full.split(',').slice(1).join(',')}
                                                    </span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {event.venue && (
                            <div className="flex items-center gap-2 text-gray-700 pt-2">
                                <MapPin size={20} className="text-brand-500" />
                                <span className="font-medium">{event.venue.name}{event.city && `, ${event.city.name}`}</span>
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
                    </Motion.div>

                    {/* Booking Section */}
                    <Motion.div
                        className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-8 border border-brand-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">Book Tickets</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center gap-3">
                                <Motion.button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-100 to-purple-100 hover:from-brand-200 hover:to-purple-200 flex items-center justify-center text-brand-600 font-bold transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Minus size={18} />
                                </Motion.button>
                                <Motion.span
                                    className="font-bold text-2xl w-10 text-center text-brand-600"
                                    key={quantity}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                >
                                    {quantity}
                                </Motion.span>
                                <Motion.button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-100 to-purple-100 hover:from-brand-200 hover:to-purple-200 flex items-center justify-center text-brand-600 font-bold transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Plus size={18} />
                                </Motion.button>
                            </div>
                        </div>
                        <Motion.div
                            className="flex justify-between items-center mb-6 pb-6 border-b-2 border-brand-200"
                            layout
                        >
                            <span className="text-gray-700 font-medium">Total:</span>
                            <Motion.span
                                className="font-black text-2xl bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                                key={quantity}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                ₹{quantity * event.price}
                            </Motion.span>
                        </Motion.div>
                        <Motion.button
                            onClick={handleBooking}
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/30"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {processing ? 'Processing...' : 'Proceed to Payment'}
                        </Motion.button>
                    </Motion.div>
                </Motion.div>
            </div>
        </Motion.div>
    );
};

export default EventDetail;

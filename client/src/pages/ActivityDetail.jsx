import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from '../context/LocationContext';
import { fetchActivityById, createBooking, verifyPayment } from '../api';
import { MapPin, Clock, DollarSign, Users, AlertCircle, Minus, Plus, Heart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import { useWishlist } from '../hooks/useWishlist';
import { handleImageError } from '../utils/imageUtils';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { selectedCity } = useLocation();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [participants, setParticipants] = useState(1);
    const [initialCity, setInitialCity] = useState(null);

    const { isWishlisted, toggle, message: wishlistMessage } = useWishlist(id, 'Activity');

    useEffect(() => {
        const getActivity = async () => {
            try {
                const { data } = await fetchActivityById(id);
                setActivity(data);
                if (!initialCity && data.city) {
                    setInitialCity(data.city.slug);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getActivity();
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
            alert('Please sign in to book this activity');
            navigate('/sign-in');
            return;
        }

        setProcessing(true);

        try {
            const { data } = await createBooking({
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                entityId: activity._id,
                entityType: 'Activity',
                venueId: activity.venue?._id,
                quantity: participants,
                totalAmount: participants * activity.price
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'BlockBuster',
                description: `Activity: ${activity.title}`,
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
                                movie: null
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

    if (loading) return <Loader />;
    if (!activity) return <div className="p-10 text-center">Activity not found</div>;

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <Motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Motion.img
                        src={activity.image || 'https://placehold.co/600x400'}
                        alt={activity.title}
                        className="w-full rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        onError={(e) => handleImageError(e, 'activity')}
                        loading="lazy"
                    />
                </Motion.div>

                {/* Details */}
                <Motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Motion.h1
                        className="text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {activity.title}
                    </Motion.h1>

                    {/* Type & Wishlist */}
                    <div className="flex items-center gap-4 mb-4 relative">
                        {activity.type && (
                            <span className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {activity.type}
                            </span>
                        )}
                        {activity.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                activity.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {activity.difficulty}
                            </span>
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

                    {activity.description && (
                        <p className="text-gray-600 mb-6">{activity.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
                        {activity.venue && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin size={20} className="text-brand-500" />
                                <span>{activity.venue.name}{activity.city && `, ${activity.city.name}`}</span>
                            </div>
                        )}

                        {activity.duration && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={20} className="text-brand-500" />
                                <span>Duration: {activity.duration}</span>
                            </div>
                        )}

                        {activity.groupSize && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Users size={20} className="text-brand-500" />
                                <span>Group Size: {activity.groupSize}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign size={20} className="text-brand-500" />
                            <span className="font-bold text-brand-600">₹{activity.price} per person</span>
                        </div>
                    </div>

                    {activity.inclusions && activity.inclusions.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">What's Included:</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {activity.inclusions.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activity.requirements && activity.requirements.length > 0 && (
                        <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={18} className="text-yellow-600" />
                                <h3 className="font-bold text-yellow-900">Requirements:</h3>
                            </div>
                            <ul className="list-disc list-inside text-yellow-800 space-y-1">
                                {activity.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Booking */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Book this Activity</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700">Number of Participants:</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-xl w-8 text-center">{participants}</span>
                                <button
                                    onClick={() => setParticipants(participants + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-lg">
                            <span>Total:</span>
                            <span className="font-bold text-brand-600">₹{participants * activity.price}</span>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={processing}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold transition-colors"
                        >
                            {processing ? 'Processing...' : 'Book Now'}
                        </button>
                    </div>
                </Motion.div>
            </div>
        </Motion.div>
    );
};

export default ActivityDetail;

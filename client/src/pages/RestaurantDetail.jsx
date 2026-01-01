import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchRestaurantById, createBooking, verifyPayment } from '../api';
import { MapPin, Phone, Clock, DollarSign, Utensils, Star, ExternalLink, Minus, Plus } from 'lucide-react';

const RestaurantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [guests, setGuests] = useState(2);

    useEffect(() => {
        const getRestaurant = async () => {
            try {
                const { data } = await fetchRestaurantById(id);
                setRestaurant(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getRestaurant();
    }, [id]);

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

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!restaurant) return <div className="p-10 text-center">Restaurant not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                    <img
                        src={restaurant.image || 'https://via.placeholder.com/600x400'}
                        alt={restaurant.title}
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">{restaurant.title}</h1>

                    {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <Utensils size={18} className="text-brand-500" />
                            <span className="text-gray-600">{restaurant.cuisine.join(', ')}</span>
                        </div>
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
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Make a Reservation</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700">Number of Guests:</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-xl w-8 text-center">{guests}</span>
                                <button
                                    onClick={() => setGuests(guests + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                            <span>Booking Fee (₹100 per person):</span>
                            <span className="font-bold text-brand-600">₹{guests * 100}</span>
                        </div>
                        <button
                            onClick={handleReservation}
                            disabled={processing}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold transition-colors"
                        >
                            {processing ? 'Processing...' : 'Reserve Table'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;

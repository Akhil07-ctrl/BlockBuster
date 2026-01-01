import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchEventById, createBooking, verifyPayment } from '../api';
import { Calendar, MapPin, Minus, Plus, User, Tag } from 'lucide-react';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const getEvent = async () => {
            try {
                const { data } = await fetchEventById(id);
                setEvent(data);
            } catch (err) {
                console.error(err);
            }
        };
        getEvent();
    }, [id]);

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

    if (!event) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Event Image */}
                <div>
                    <img
                        src={event.image || 'https://via.placeholder.com/600x400'}
                        alt={event.title}
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>

                {/* Event Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">{event.title}</h1>

                    {/* Event Type */}
                    {event.type && (
                        <span className="inline-block bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                            {event.type}
                        </span>
                    )}

                    {event.description && (
                        <p className="text-gray-600 mb-6">{event.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
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
                    </div>

                    {/* Booking Section */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-lg mb-4">Book Tickets</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700">Quantity:</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-lg">
                            <span>Total:</span>
                            <span className="font-bold text-brand-600">₹{quantity * event.price}</span>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={processing}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold transition-colors"
                        >
                            {processing ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

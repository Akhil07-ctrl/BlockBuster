import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, Calendar, CreditCard, Minus, Plus } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [bookingState, setBookingState] = useState('idle'); // idle, booking, success

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleBook = async () => {
        if (!user) return navigate('/sign-in');

        setBookingState('booking');
        try {
            await api.post('/bookings', {
                userId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                entityId: event._id,
                entityType: event.category === 'Dining' ? 'Dining' : 'Event',
                venueId: event.venue?._id,
                date: event.date,
                quantity: quantity,
                totalAmount: event.price * quantity
            });
            navigate('/booking/success');
        } catch (err) {
            console.error(err);
            alert('Booking failed');
            setBookingState('idle');
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="h-screen flex items-center justify-center">Event not found</div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Image */}
            <div className="h-[300px] md:h-[400px] bg-gray-200 relative">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-white container mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                    <p className="flex items-center gap-2 opacity-90"><MapPin size={18} /> {event.venue?.name}, {event.city?.name}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-12">
                {/* Left Content */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed mb-8">{event.description || "No description available."}</p>

                    <div className="flex items-center gap-4 text-gray-700 mb-8 p-4 bg-gray-50 rounded-xl border">
                        <Calendar className="text-brand-500" />
                        <div>
                            <p className="text-sm text-gray-400">Date & Time</p>
                            <p className="font-semibold">{event.date ? new Date(event.date).toLocaleString() : 'Open'}</p>
                        </div>
                    </div>
                </div>

                {/* Right Booking Card */}
                <div className="w-full md:w-96">
                    <div className="bg-white border rounded-2xl shadow-lg p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500">Price</span>
                            <span className="text-2xl font-bold text-gray-900">₹{event.price}</span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-medium">Guests</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 rounded hover:bg-gray-100 border"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold w-6 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                    className="p-2 rounded hover:bg-gray-100 border"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>₹{event.price * quantity}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={bookingState === 'booking'}
                            className="bg-brand-500 hover:bg-brand-600 text-white w-full py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
                        >
                            {bookingState === 'booking' ? 'Processing...' : 'Book Tickets'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

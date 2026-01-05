import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchMovieById, createBooking, verifyPayment, fetchVenues } from '../api';
import Loader from '../components/Loader';
import { MapPin, Clock, Monitor } from 'lucide-react';

const SeatBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useUser();
    
    const venueId = searchParams.get('venueId');
    const showtime = searchParams.get('showtime');
    const priceFromURL = parseInt(searchParams.get('price'));
    const screenName = searchParams.get('screen');

    const [movie, setMovie] = useState(null);
    const [venue, setVenue] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 10;
    const pricePerSeat = priceFromURL || 250;

    useEffect(() => {
        const getData = async () => {
            try {
                const [movieRes] = await Promise.all([
                    fetchMovieById(id)
                ]);
                setMovie(movieRes.data);
                
                // If we have venueId, we could fetch venue details too for display
                // But since we don't have fetchVenueById, let's just use what we have or add it
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const toggleSeat = (seat) => {
        setSelectedSeats(prev =>
            prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
        );
    };

    const handlePayment = async () => {
        if (!user) {
            alert('Please sign in to book tickets');
            navigate('/sign-in');
            return;
        }

        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        setProcessing(true);

        try {
            // Create booking and get Razorpay order
            const { data } = await createBooking({
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                entityId: movie._id,
                entityType: 'Movie',
                venueId: venueId,
                date: new Date(), // Use selected date if available
                seats: selectedSeats,
                quantity: selectedSeats.length,
                totalAmount: selectedSeats.length * pricePerSeat
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'BlockBuster',
                description: `Movie: ${movie.title}`,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        // Verify payment
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
                    name: user.fullName,
                    email: user.primaryEmailAddress.emailAddress
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
    if (!movie) return <div className="p-10 text-center">Movie not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{movie.title}</h1>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {showtime && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg">
                                <Clock size={12} className="text-brand-500" />
                                {showtime}
                            </span>
                        )}
                        {screenName && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg">
                                <Monitor size={12} className="text-brand-500" />
                                {screenName}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price per seat</p>
                    <p className="text-2xl font-black text-brand-600">₹{pricePerSeat}</p>
                </div>
            </div>

            {/* Screen */}
            <div className="mb-8 max-w-3xl mx-auto">
                <div className="w-full h-3 bg-gradient-to-b from-gray-400 to-gray-200 rounded-t-full mb-2"></div>
                <p className="text-center text-sm text-gray-500 uppercase tracking-widest">Screen</p>
            </div>

            {/* Seats Grid */}
            <div className="mb-12 overflow-x-auto no-scrollbar pb-6">
                <div className="max-w-3xl mx-auto min-w-max px-4">
                    {rows.map(row => (
                        <div key={row} className="flex justify-center gap-2 mb-3">
                            <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 text-sm">{row}</span>
                            {[...Array(seatsPerRow)].map((_, i) => {
                                const seatNumber = `${row}${i + 1}`;
                                const isSelected = selectedSeats.includes(seatNumber);
                                return (
                                    <button
                                        key={seatNumber}
                                        onClick={() => toggleSeat(seatNumber)}
                                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-t-xl border-2 transition-all flex items-center justify-center text-xs font-bold ${isSelected
                                                ? 'bg-brand-500 border-brand-600 text-white shadow-lg shadow-brand-500/30'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded-t-lg"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-500 border-2 border-brand-600 rounded-t-lg"></div>
                    <span>Selected</span>
                </div>
            </div>

            {/* Booking Summary */}
            <div className="max-w-md mx-auto bg-white rounded-xl border p-6 shadow-lg">
                <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span>Selected Seats:</span>
                        <span className="font-bold">{selectedSeats.join(', ') || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Price per seat:</span>
                        <span>₹{pricePerSeat}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-brand-600">₹{selectedSeats.length * pricePerSeat}</span>
                    </div>
                </div>
                <button
                    onClick={handlePayment}
                    disabled={selectedSeats.length === 0 || processing}
                    className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-colors"
                >
                    {processing ? 'Processing...' : 'Proceed to Payment'}
                </button>
            </div>
        </div>
    );
};

export default SeatBooking;

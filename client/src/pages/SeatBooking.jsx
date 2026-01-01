import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchMovieById, createBooking, verifyPayment } from '../api';

const SeatBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [movie, setMovie] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = 10;
    const pricePerSeat = 250;

    useEffect(() => {
        const getMovie = async () => {
            try {
                const { data } = await fetchMovieById(id);
                setMovie(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getMovie();
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

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!movie) return <div className="p-10 text-center">Movie not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-600 mb-8">Select your seats</p>

            {/* Screen */}
            <div className="mb-8">
                <div className="w-full h-3 bg-gradient-to-b from-gray-400 to-gray-200 rounded-t-full mb-2"></div>
                <p className="text-center text-sm text-gray-500">SCREEN</p>
            </div>

            {/* Seats Grid */}
            <div className="max-w-3xl mx-auto mb-8">
                {rows.map(row => (
                    <div key={row} className="flex justify-center gap-2 mb-2">
                        <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                        {[...Array(seatsPerRow)].map((_, i) => {
                            const seatNumber = `${row}${i + 1}`;
                            const isSelected = selectedSeats.includes(seatNumber);
                            return (
                                <button
                                    key={seatNumber}
                                    onClick={() => toggleSeat(seatNumber)}
                                    className={`w-8 h-8 rounded-t-lg border-2 transition-all ${isSelected
                                            ? 'bg-brand-500 border-brand-600 text-white'
                                            : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                ))}
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

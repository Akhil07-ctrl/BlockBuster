import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useUser } from "@clerk/clerk-react";
import api from '../api';

const ROWS = 8;
const COLS = 10;
const PRICE = 250;

const SeatBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookingState, setBookingState] = useState('idle');

    // Mock occupied seats (in a real app, fetch from backend)
    const occupiedSeats = ['3-4', '3-5', '5-5', '5-6'];

    const handleSeatClick = (row, col) => {
        const seatId = `${row}-${col}`;
        if (occupiedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleBook = async () => {
        if (!user) return navigate('/sign-in');

        setBookingState('booking');
        try {
            await api.post('/bookings', {
                userId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                entityId: id, // Movie ID
                entityType: 'Movie',
                // venueId: ... (We'd need to fetch movie details to get venue, neglecting for MVP)
                date: new Date(),
                seats: selectedSeats,
                quantity: selectedSeats.length,
                totalAmount: selectedSeats.length * PRICE
            });
            navigate('/booking/success');
        } catch (err) {
            console.error(err);
            alert('Booking failed');
            setBookingState('idle');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center gap-4">
                <button onClick={() => navigate(-1)}><ArrowLeft /></button>
                <div>
                    <h2 className="font-bold">Select Seats</h2>
                    <p className="text-xs text-gray-400">PVR Icon: Hitech City | Today, 18:00</p>
                </div>
            </div>

            <div className="flex-grow overflow-auto p-10 flex flex-col items-center">
                {/* Screen */}
                <div className="w-full max-w-2xl text-center mb-12">
                    <div className="h-1 bg-brand-500 shadow-[0_20px_50px_rgba(239,68,68,0.3)] mb-2 w-full mx-auto rounded-full"></div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Screen this way</p>
                </div>

                {/* Seats */}
                <div className="grid gap-4">
                    {Array.from({ length: ROWS }).map((_, r) => (
                        <div key={r} className="flex gap-2 justify-center">
                            {Array.from({ length: COLS }).map((_, c) => {
                                const seatId = `${r}-${c}`;
                                const isOccupied = occupiedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(r, c)}
                                        disabled={isOccupied}
                                        className={clsx(
                                            "w-8 h-8 rounded text-xs flex items-center justify-center transition-all",
                                            isOccupied ? "bg-gray-700 cursor-not-allowed" :
                                                isSelected ? "bg-brand-500 text-white shadow-lg scale-110" : "border border-brand-500/30 hover:bg-brand-500/20 text-brand-500"
                                        )}
                                    >

                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-12 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 border border-brand-500/30"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700"></div> Booked</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-500"></div> Selected</div>
                </div>
            </div>

            {/* Footer */}
            {selectedSeats.length > 0 && (
                <div className="p-4 bg-white text-black shadow-up-lg flex justify-between items-center animate-in slide-in-from-bottom">
                    <div>
                        <p className="text-xs text-gray-500">{selectedSeats.length} Tickets</p>
                        <p className="font-bold text-xl">₹{selectedSeats.length * PRICE}</p>
                    </div>
                    <button
                        className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
                        onClick={handleBook}
                        disabled={bookingState === 'booking'}
                    >
                        {bookingState === 'booking' ? 'Processing...' : 'Pay & Confirm'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatBooking;

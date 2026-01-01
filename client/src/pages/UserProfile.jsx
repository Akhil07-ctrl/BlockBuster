import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserBookings } from '../api';
import { Calendar, MapPin, CreditCard, Package } from 'lucide-react';

const UserProfile = () => {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                const { data } = await getUserBookings(user.id);
                setBookings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Please sign in to view your profile</div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl p-8 mb-8">
                <div className="flex items-center gap-6">
                    <img
                        src={user.imageUrl}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                        <p className="text-brand-100">{user.primaryEmailAddress?.emailAddress}</p>
                        <p className="text-sm text-brand-200 mt-2">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-xl border p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Package className="text-brand-500" />
                    Booking History
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Package size={64} className="mx-auto mb-4 opacity-30" />
                        <p>No bookings yet. Start exploring!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-semibold uppercase text-gray-500">{booking.entityType}</span>
                                        <h3 className="text-lg font-bold mt-1">Booking #{booking._id.slice(-8)}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {booking.date && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={16} />
                                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {booking.venueId && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin size={16} />
                                            <span>{booking.venueId.name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CreditCard size={16} />
                                        <span className="font-bold text-brand-600">₹{booking.totalAmount}</span>
                                    </div>
                                </div>

                                {booking.seats && booking.seats.length > 0 && (
                                    <div className="mt-3 text-sm text-gray-600">
                                        <span className="font-semibold">Seats:</span> {booking.seats.join(', ')}
                                    </div>
                                )}

                                {booking.quantity > 1 && (
                                    <div className="mt-3 text-sm text-gray-600">
                                        <span className="font-semibold">Quantity:</span> {booking.quantity}
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                                    Booked on {new Date(booking.createdAt).toLocaleString()}
                                    {booking.paymentId && (
                                        <span className="ml-4">Payment ID: {booking.paymentId}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;

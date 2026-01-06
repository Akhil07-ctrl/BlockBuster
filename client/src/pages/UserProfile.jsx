import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserBookings, getWishlist, toggleWishlist } from '../api';
import { Calendar, MapPin, CreditCard, Package, Heart, Trash2, ExternalLink, Clock, Film, Music, Utensils, ShoppingBag, Zap } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const { user } = useUser();
    const [bookings, setBookings] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'wishlist'
    const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'confirmed', 'pending', 'failed'

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [bookingsRes, wishlistRes] = await Promise.all([
                    getUserBookings(user.id),
                    getWishlist(user.id)
                ]);
                setBookings(bookingsRes.data);
                setWishlist(wishlistRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const filteredBookings = bookings.filter(booking => {
        if (bookingFilter === 'all') return true;
        return booking.status === bookingFilter;
    });

    const handleRemoveFromWishlist = async (itemId, itemType) => {
        try {
            await toggleWishlist({
                clerkId: user.id,
                itemId,
                itemType
            });
            setWishlist(wishlist.filter(item => item.itemId !== itemId));
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
                    <p className="text-gray-500 mb-6">You need to be logged in to view your profile and bookings.</p>
                    <Link to="/sign-in" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEntityTypeIcon = (type) => {
        switch (type) {
            case 'Movie': return <Film size={14} />;
            case 'Event': return <Music size={14} />;
            case 'Restaurant': return <Utensils size={14} />;
            case 'Store': return <ShoppingBag size={14} />;
            case 'Activity': return <Zap size={14} />;
            default: return <Package size={14} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* User Info Header */}
            <div className="bg-gray-950 text-white pt-20 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-20 w-80 h-80 bg-brand-500 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-600 rounded-full blur-[100px]"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <Motion.div 
                        className="flex flex-col md:flex-row items-center gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="relative">
                            <Motion.img
                                src={user.imageUrl}
                                alt={user.fullName}
                                className="w-32 h-32 rounded-3xl border-4 border-white/10 shadow-2xl object-cover"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                            />
                            <div className="absolute -bottom-2 -right-2 bg-brand-500 text-white p-2 rounded-xl shadow-lg">
                                <Package size={20} />
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{user.fullName}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400">
                                <span className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-brand-500" />
                                    {user.primaryEmailAddress?.emailAddress}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={16} className="text-brand-500" />
                                    Member since {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                {/* Tabs Navigation */}
                <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 mb-8 max-w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Package size={18} />
                        My Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'wishlist' ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Heart size={18} />
                        Hotlist
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'bookings' ? (
                        <Motion.div 
                            key="bookings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Booking Filters */}
                            {!loading && bookings.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {['all', 'confirmed', 'pending', 'failed'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setBookingFilter(filter)}
                                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest border-2 transition-all ${
                                                bookingFilter === filter 
                                                ? 'bg-gray-900 border-gray-900 text-white shadow-lg' 
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {loading ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
                                    <div className="inline-block w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-gray-500 font-medium">Loading your bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-xl shadow-gray-200/50">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Package size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Your journey awaits! Browse our collection of movies and events to make your first booking.</p>
                                    <Link to="/movies" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/20">
                                        Explore Movies
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-xl shadow-gray-200/50">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Package size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No {bookingFilter} bookings</h3>
                                    <p className="text-gray-500 mb-4">You don't have any bookings with status "{bookingFilter}".</p>
                                    <button 
                                        onClick={() => setBookingFilter('all')}
                                        className="text-brand-600 font-bold hover:underline"
                                    >
                                        Show all bookings
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredBookings.map((booking) => (
                                        <Motion.div 
                                            key={booking._id} 
                                            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                {/* Booking Image */}
                                                <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img 
                                                        src={booking.entityType === 'Movie' ? booking.entityId?.poster : booking.entityId?.image} 
                                                        alt={booking.entityId?.title || booking.entityId?.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-brand-600 font-bold text-[10px] uppercase tracking-widest">
                                                                {getEntityTypeIcon(booking.entityType)}
                                                                {booking.entityType}
                                                            </div>
                                                            <h3 className="text-xl font-black text-gray-900 line-clamp-1 uppercase tracking-tight">
                                                                {booking.entityId?.title || booking.entityId?.name || `Booking #${booking._id.slice(-6)}`}
                                                            </h3>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm flex-shrink-0 ${getStatusColor(booking.status)}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            {booking.date && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                        <Calendar size={12} />
                                                                    </div>
                                                                    <span className="font-bold text-xs">{new Date(booking.date).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                            {booking.venueId && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                        <MapPin size={12} />
                                                                    </div>
                                                                    <span className="font-bold text-xs line-clamp-1">{booking.venueId.name}</span>
                                                                </div>
                                                            )}
                                                            {booking.showTime && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                        <Clock size={12} />
                                                                    </div>
                                                                    <span className="font-bold text-xs">{booking.showTime}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                    <CreditCard size={12} />
                                                                </div>
                                                                <span className="font-black text-xs text-brand-600">₹{booking.totalAmount}</span>
                                                            </div>
                                                            {booking.seats && booking.seats.length > 0 && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                        <Package size={12} />
                                                                    </div>
                                                                    <span className="font-bold text-xs truncate">Seats: {booking.seats.join(', ')}</span>
                                                                </div>
                                                            )}
                                                            {booking.quantity > 0 && !booking.seats?.length && (
                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                    <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                                                        <Package size={12} />
                                                                    </div>
                                                                    <span className="font-bold text-xs">Qty: {booking.quantity}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                                                        {booking.paymentId && <span className="text-brand-500/50">Ref: {booking.paymentId.slice(0, 8)}...</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </Motion.div>
                                    ))}
                                </div>
                            )}
                        </Motion.div>
                    ) : (
                        <Motion.div 
                            key="wishlist"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {loading ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
                                    <div className="inline-block w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-gray-500 font-medium">Loading your Hotlist...</p>
                                </div>
                            ) : wishlist.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-xl shadow-gray-200/50">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Heart size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Hotlist is empty</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Found something you like? Click the heart icon to save it here for later.</p>
                                    <Link to="/movies" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/20">
                                        Browse Movies
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {wishlist.map((item) => (
                                        <Motion.div 
                                            key={item.itemId} 
                                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
                                            whileHover={{ y: -8 }}
                                        >
                                            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                                                <img 
                                                    src={item.details?.poster || item.details?.image || 'https://via.placeholder.com/400x600'} 
                                                    alt={item.details?.title || item.details?.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                                                
                                                <button 
                                                    onClick={() => handleRemoveFromWishlist(item.itemId, item.itemType)}
                                                    className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md hover:bg-brand-500 text-white rounded-xl transition-all shadow-lg border border-white/20"
                                                    title="Remove from Hotlist"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="flex items-center gap-2 text-brand-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                                                        {getEntityTypeIcon(item.itemType)}
                                                        {item.itemType}
                                                    </div>
                                                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-brand-400 transition-colors">
                                                        {item.details?.title || item.details?.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="p-4 flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500">
                                                    {item.itemType === 'Movie' && item.details?.rating ? `${item.details.rating} ★` :
                                                     item.itemType === 'Event' && item.details?.price ? `₹${item.details.price}` :
                                                     item.itemType === 'Restaurant' && item.details?.cuisine ? item.details.cuisine[0] :
                                                     item.itemType === 'Store' && item.details?.category ? item.details.category :
                                                     item.itemType === 'Activity' && item.details?.price ? `₹${item.details.price}` : 'Featured'}
                                                </span>
                                                <Link 
                                                    to={`/${item.itemType.toLowerCase()}s/${item.itemId}`}
                                                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                                                >
                                                    View Details
                                                    <ExternalLink size={12} />
                                                </Link>
                                            </div>
                                        </Motion.div>
                                    ))}
                                </div>
                            )}
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserProfile;

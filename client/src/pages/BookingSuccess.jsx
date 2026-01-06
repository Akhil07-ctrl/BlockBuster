import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Ticket, MapPin, Download, ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const BookingSuccess = () => {
    const location = useLocation();
    const { booking, movie } = location.state || {};

    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                    <CheckCircle size={40} className="opacity-20" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Booking Found</h1>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">It seems you reached this page directly. Please complete a booking to see your tickets.</p>
                <Link to="/" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-600/20">
                    Go to Home
                </Link>
            </div>
        );
    }

    const [confettiItems, setConfettiItems] = useState([]);

    useEffect(() => {
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
        setConfettiItems([...Array(20)].map((_, i) => ({
            id: i,
            initialX: Math.random() * 100 - 50,
            animateX: Math.random() * 400 - 200,
            duration: 3 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            delay: Math.random() * 2
        })));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 py-20 bg-gray-50 overflow-hidden">
            {/* Confetti effect */}
            {confettiItems.map((item) => (
                <Motion.div
                    key={item.id}
                    className="absolute rounded-full z-0"
                    style={{ 
                        backgroundColor: item.color,
                        width: item.size,
                        height: item.size
                    }}
                    initial={{ 
                        opacity: 1, 
                        x: `${item.initialX}vw`, 
                        y: -100 
                    }}
                    animate={{ 
                        opacity: [1, 1, 0], 
                        y: '110vh',
                        x: `${item.animateX}vw`,
                        rotate: 360
                    }}
                    transition={{ 
                        duration: item.duration,
                        ease: 'linear',
                        repeat: Infinity,
                        delay: item.delay
                    }}
                ></Motion.div>
            ))}

            <Motion.div 
                className="w-full max-w-2xl relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Success Icon */}
                <Motion.div 
                    className="flex flex-col items-center mb-8"
                    variants={itemVariants}
                >
                    <Motion.div 
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20 mb-6"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <CheckCircle size={40} strokeWidth={3} />
                    </Motion.div>
                    <h1 className="text-4xl font-black text-gray-900 text-center uppercase tracking-tight">
                        Booking Successful!
                    </h1>
                    <p className="text-gray-500 font-medium mt-2">
                        Your tickets are confirmed and ready.
                    </p>
                </Motion.div>

                {/* Ticket Card */}
                <Motion.div 
                    className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 mb-8"
                    variants={itemVariants}
                >
                    <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-brand-100 text-[10px] font-black uppercase tracking-widest mb-1">Booking ID</p>
                                <p className="text-xl font-mono font-bold">#{booking?._id?.toString().slice(-8).toUpperCase() || 'BT-882910'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-brand-100 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                                    {booking?.status || 'Confirmed'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {movie?.poster && (
                                <div className="w-full md:w-32 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                                    {movie?.title || booking?.entityId?.title || 'Movie Title'}
                                </h2>
                                
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Date & Time</p>
                                            <p className="text-xs font-bold text-gray-700">
                                                {booking?.date ? new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'} • {booking?.showTime || '7:30 PM'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <Ticket size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Seats</p>
                                            <p className="text-xs font-bold text-gray-700">{booking?.seats?.join(', ') || 'A1, A2'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 col-span-2">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Location</p>
                                            <p className="text-xs font-bold text-gray-700">{booking?.venueId?.name || 'PVR Cinema, Nexus Mall'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
                                    <div className="grid grid-cols-3 gap-1">
                                        {[...Array(9)].map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-sm ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Scan this at the venue</p>
                                    <p className="text-sm font-bold text-gray-800">M-Ticket Available</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                                <p className="text-2xl font-black text-brand-600">₹{booking?.totalAmount || '500'}</p>
                            </div>
                        </div>
                    </div>
                </Motion.div>

                {/* Actions */}
                <Motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    variants={itemVariants}
                >
                    <Link 
                        to="/profile" 
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-brand-500 hover:text-brand-600 text-gray-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                    >
                        <Ticket size={18} />
                        View My Bookings
                    </Link>
                    <Link 
                        to="/" 
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-600/20 transition-all"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </Motion.div>

                <Motion.div 
                    className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4"
                    variants={itemVariants}
                >
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                        <ArrowRight size={16} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight mb-1">What's Next?</h4>
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                            A confirmation email has been sent to your registered address. Please carry your mobile ticket and reach the venue 15 minutes before the show.
                        </p>
                    </div>
                </Motion.div>
            </Motion.div>
        </div>
    );
};

export default BookingSuccess;

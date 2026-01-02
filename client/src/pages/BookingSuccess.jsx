import { Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingSuccess = () => {
    return (
        <motion.div 
            className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-white via-green-50/30 to-emerald-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-10 right-10 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                ></motion.div>
                <motion.div
                    className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                ></motion.div>
            </div>

            {/* Confetti effect (simulated with animated elements) */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-green-500 rounded-full"
                    initial={{ 
                        opacity: 1, 
                        x: Math.random() * 100 - 50, 
                        y: -100 
                    }}
                    animate={{ 
                        opacity: [1, 1, 0], 
                        y: window.innerHeight,
                        x: Math.random() * 300 - 150
                    }}
                    transition={{ 
                        duration: 2.5 + Math.random() * 0.5,
                        ease: 'easeIn',
                        repeat: Infinity,
                        repeatDelay: 2
                    }}
                ></motion.div>
            ))}

            {/* Main Content */}
            <motion.div 
                className="relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <motion.div 
                    className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <CheckCircle size={56} fill="currentColor" />
                    </motion.div>
                </motion.div>

                <motion.h1 
                    className="text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Booking Confirmed!
                </motion.h1>

                <motion.p 
                    className="text-gray-600 mb-10 max-w-md text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Your booking has been successfully completed. We've sent all the details to your email. Get ready for an amazing experience!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-brand-600/30 transition-all"
                    >
                        <Home size={20} />
                        Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default BookingSuccess;

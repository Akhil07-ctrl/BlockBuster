import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const NotFound = () => {
    return (
        <Motion.div 
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-gray-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Motion.div
                    className="absolute top-20 right-20 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                ></Motion.div>
                <Motion.div
                    className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"
                    animate={{ x: [0, 40, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                ></Motion.div>
            </div>

            {/* Main Content */}
            <Motion.div 
                className="text-center px-4 relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }}
            >
                {/* Animated Icon */}
                <Motion.div
                    className="mb-8 flex justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.3 }}
                >
                    <Motion.div
                        className="text-8xl font-black bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        404
                    </Motion.div>
                </Motion.div>

                {/* Alert Icon Animation */}
                <Motion.div 
                    className="mb-6 flex justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Motion.div
                        className="p-4 bg-gradient-to-br from-brand-100 to-purple-100 rounded-full text-brand-600"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <AlertCircle size={48} />
                    </Motion.div>
                </Motion.div>

                <Motion.h2 
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Page Not Found
                </Motion.h2>

                <Motion.p 
                    className="text-gray-600 mb-10 max-w-md mx-auto text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </Motion.p>

                {/* Action Buttons */}
                <Motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-600/30 transition-all"
                        >
                            <Home size={20} />
                            Go to Homepage
                        </Link>
                    </Motion.div>
                    <Motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-3 rounded-xl font-bold transition-all"
                        >
                            <Search size={20} />
                            Explore Content
                        </Link>
                    </Motion.div>
                </Motion.div>
            </Motion.div>
        </Motion.div>
    );
};

export default NotFound;

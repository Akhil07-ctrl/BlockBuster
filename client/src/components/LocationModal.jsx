import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchCities } from '../api';
import { MapPin, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const LocationModal = () => {
    const { selectedCity, updateCity } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCityLocal, setSelectedCityLocal] = useState(null);

    useEffect(() => {
        if (!selectedCity) {
            setIsOpen(true);
        }
    }, [selectedCity]);

    useEffect(() => {
        const getCities = async () => {
            try {
                const { data } = await fetchCities();
                console.log("Fetched Cities:", data);
                setCities(data);
            } catch (err) {
                console.error("Failed to fetch cities:", err);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            getCities();
        }
    }, [isOpen]);

    const handleSelect = (city) => {
        setSelectedCityLocal(city);
        setTimeout(() => {
            updateCity(city);
            setIsOpen(false);
        }, 300);
    };

    if (!isOpen && selectedCity) return null;

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: { duration: 0.3 }
        }
    };

    const cityVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: 'easeOut'
            }
        })
    };

    return (

        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3 }}
                        onClick={() => selectedCity && setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl pointer-events-auto"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.95) 100%)',
                                backdropFilter: 'blur(24px)',
                            }}
                        >
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    className="absolute -top-32 -right-32 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl"
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                ></motion.div>
                                <motion.div
                                    className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                ></motion.div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Header */}
                                <motion.div
                                    className="px-8 pt-8 pb-6 border-b border-gray-200/50 bg-gradient-to-r from-brand-50/50 via-white to-purple-50/50"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <motion.div
                                                    className="p-2.5 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl text-white shadow-lg"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <MapPin size={24} />
                                                </motion.div>
                                                <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                                                    Select Your City
                                                </h2>
                                            </div>
                                            <p className="text-gray-600 font-medium ml-11">
                                                Discover amazing experiences near you
                                            </p>
                                        </motion.div>
                                        {selectedCity && (
                                            <motion.button
                                                onClick={() => setIsOpen(false)}
                                                className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <X size={24} className="text-gray-700" />
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Cities Grid */}
                                <div
                                    className="p-8 max-h-[60vh] overflow-y-auto"
                                    data-lenis-prevent
                                >
                                    {loading ? (
                                        <div className="py-20 text-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                className="inline-block mb-4"
                                            >
                                                <div className="w-12 h-12 border-3 border-brand-200 border-t-brand-600 rounded-full"></div>
                                            </motion.div>
                                            <p className="text-gray-600 font-medium font-brand">Locating Cities...</p>
                                        </div>
                                    ) : cities.length > 0 ? (
                                        <motion.div
                                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-4"
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {cities.map((city, i) => (
                                                <motion.button
                                                    key={city._id || i}
                                                    custom={i}
                                                    variants={cityVariants}
                                                    onClick={() => handleSelect(city)}
                                                    whileHover={{ y: -8, scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all overflow-hidden group border ${selectedCityLocal?._id === city._id || selectedCity?._id === city._id
                                                        ? 'ring-2 ring-brand-500 bg-brand-50/50 border-brand-200'
                                                        : 'bg-white/50 border-gray-200/50 hover:border-brand-300 hover:bg-white'
                                                        }`}
                                                >
                                                    {/* Animated background on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                    {/* Image */}
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-white transition-transform group-hover:scale-110">
                                                        <img
                                                            src={city.image || `https://placehold.co/100x100?text=${city.name}`}
                                                            alt={city.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                                    </div>

                                                    {/* Text */}
                                                    <div className="relative text-center">
                                                        <p className={`font-bold transition-colors text-sm ${selectedCityLocal?._id === city._id || selectedCity?._id === city._id
                                                            ? 'text-brand-700'
                                                            : 'text-gray-900 group-hover:text-brand-600'
                                                            }`}>
                                                            {city.name}
                                                        </p>
                                                    </div>

                                                    {/* Selection indicator */}
                                                    {(selectedCityLocal?._id === city._id || selectedCity?._id === city._id) && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-2 right-2"
                                                        >
                                                            <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                                ✓
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className="py-16 text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4 shadow-inner">
                                                <Sparkles size={32} className="text-brand-300" />
                                            </div>
                                            <p className="text-gray-600 font-medium">No cities discovered yet</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LocationModal;

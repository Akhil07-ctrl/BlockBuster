import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchCities } from '../api';
import { MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationModal = () => {
    const { selectedCity, updateCity } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Force open if no city selected
    useEffect(() => {
        if (!selectedCity) {
            setIsOpen(true);
        }
    }, [selectedCity]);

    // Fetch Cities
    useEffect(() => {
        const getCities = async () => {
            try {
                const { data } = await fetchCities();
                setCities(data);
            } catch (err) {
                console.error("Failed to fetch cities", err);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            getCities();
        }
    }, [isOpen]);

    const handleSelect = (city) => {
        updateCity(city);
        setIsOpen(false);
    };

    if (!isOpen && selectedCity) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center bg-brand-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <MapPin className="text-brand-600" /> Select Your City
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">To show you the best events near you</p>
                            </div>
                            {selectedCity && (
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-10">Loading cities...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {cities.map((city) => (
                                        <button
                                            key={city._id}
                                            onClick={() => handleSelect(city)}
                                            className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-brand-500 hover:bg-brand-50 transition-all group"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-sm group-hover:shadow-md">
                                                <img src={city.image || "https://via.placeholder.com/100"} alt={city.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-700 group-hover:text-brand-600">{city.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {cities.length === 0 && !loading && (
                                <div className="text-center py-10 text-gray-400">
                                    No cities found. Please add data via Postman.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LocationModal;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchStoreById } from '../api';
import { MapPin, Phone, Clock, ExternalLink, Tag, Heart } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import { useWishlist } from '../hooks/useWishlist';
import { handleImageError } from '../utils/imageUtils';

const StoreDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCity } = useLocation();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialCity, setInitialCity] = useState(null);

    const { isWishlisted, toggle } = useWishlist(id, 'Store');

    useEffect(() => {
        const getStore = async () => {
            try {
                const { data } = await fetchStoreById(id);
                setStore(data);
                if (!initialCity && data.city) {
                    setInitialCity(data.city.slug);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getStore();
    }, [id, initialCity]);

    // Navigate to home when city changes
    useEffect(() => {
        if (initialCity && selectedCity && selectedCity.slug !== initialCity) {
            navigate('/');
        }
    }, [selectedCity, initialCity, navigate]);

    if (loading) return <Loader />;
    if (!store) return <div className="p-10 text-center">Store not found</div>;

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image */}
                <Motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Motion.img
                        src={store.image || 'https://placehold.co/600x400'}
                        alt={store.title}
                        className="w-full rounded-2xl shadow-2xl"
                        whileHover={{ scale: 1.02 }}
                        onError={(e) => handleImageError(e, 'store')}
                        loading="lazy"
                    />
                </Motion.div>

                {/* Details */}
                <Motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Motion.h1
                        className="text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {store.title}
                    </Motion.h1>

                    {/* Category & Wishlist */}
                    <div className="flex items-center gap-4 mb-6 relative">
                        {store.category && (
                            <span className="inline-block bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {store.category}
                            </span>
                        )}

                        <Motion.button
                            onClick={toggle}
                            className={`p-2 rounded-full transition-all border-2 ${isWishlisted ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-gray-200 text-gray-400 hover:border-brand-500 hover:text-brand-500'}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={isWishlisted ? "Remove from Hotlist" : "Add to Hotlist"}
                        >
                            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                        </Motion.button>


                    </div>

                    {store.description && (
                        <p className="text-gray-600 mb-6">{store.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
                        {store.venue && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin size={20} className="text-brand-500" />
                                <span>{store.venue.name}{store.city && `, ${store.city.name}`}</span>
                            </div>
                        )}

                        {store.contactNumber && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone size={20} className="text-brand-500" />
                                <span>{store.contactNumber}</span>
                            </div>
                        )}

                        {store.operatingHours && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={20} className="text-brand-500" />
                                <span>{store.operatingHours}</span>
                            </div>
                        )}

                        {store.website && (
                            <div className="flex items-center gap-2">
                                <ExternalLink size={20} className="text-brand-500" />
                                <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>

                    {store.tags && store.tags.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={18} className="text-brand-500" />
                                <span className="font-semibold">Tags:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {store.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </Motion.div>
            </div>
        </Motion.div>
    );
};

export default StoreDetail;

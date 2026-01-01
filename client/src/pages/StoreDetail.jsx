import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchStoreById } from '../api';
import { MapPin, Phone, Clock, ExternalLink, Tag } from 'lucide-react';

const StoreDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCity } = useLocation();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialCity, setInitialCity] = useState(null);

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
    }, [id]);

    // Navigate to home when city changes
    useEffect(() => {
        if (initialCity && selectedCity && selectedCity.slug !== initialCity) {
            navigate('/');
        }
    }, [selectedCity, initialCity, navigate]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!store) return <div className="p-10 text-center">Store not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                    <img
                        src={store.image || 'https://via.placeholder.com/600x400'}
                        alt={store.title}
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">{store.title}</h1>

                    {store.category && (
                        <span className="inline-block bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                            {store.category}
                        </span>
                    )}

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
                </div>
            </div>
        </div>
    );
};

export default StoreDetail;

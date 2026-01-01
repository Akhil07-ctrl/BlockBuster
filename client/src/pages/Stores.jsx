import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchStores } from '../api';
import { Filter, ShoppingBag } from 'lucide-react';

const StoresPage = () => {
    const { selectedCity } = useLocation();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStores = async () => {
            if (!selectedCity) return;
            try {
                const { data } = await fetchStores(selectedCity.slug);
                setStores(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getStores();
    }, [selectedCity]);

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading stores...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-xl border opacity-70 pointer-events-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <p className="text-sm text-gray-500">Category filtering coming soon.</p>
                    </div>
                </div>

                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag className="text-brand-500" />
                        Stores in {selectedCity.name}
                    </h2>

                    {stores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stores.map(store => (
                                <div key={store._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-gray-100 group cursor-pointer">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img src={store.image || 'https://via.placeholder.com/400x300'} alt={store.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        {store.category && (
                                            <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded uppercase">
                                                {store.category}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 truncate">{store.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2 truncate">{store.venue?.name}</p>
                                        {store.website && (
                                            <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 text-sm hover:underline">
                                                Visit Website →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No stores found in {selectedCity.name} yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoresPage;

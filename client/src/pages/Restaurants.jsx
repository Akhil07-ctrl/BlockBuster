import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchRestaurants } from '../api';
import { Filter, UtensilsCrossed } from 'lucide-react';

const RestaurantsPage = () => {
    const { selectedCity } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRestaurants = async () => {
            if (!selectedCity) return;
            try {
                const { data } = await fetchRestaurants(selectedCity.slug);
                setRestaurants(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getRestaurants();
    }, [selectedCity]);

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading restaurants...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-xl border opacity-70 pointer-events-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <p className="text-sm text-gray-500">Cuisine, Price Range filtering coming soon.</p>
                    </div>
                </div>

                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <UtensilsCrossed className="text-brand-500" />
                        Restaurants in {selectedCity.name}
                    </h2>

                    {restaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map(restaurant => (
                                <div key={restaurant._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-gray-100 group cursor-pointer">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img src={restaurant.image || 'https://via.placeholder.com/400x300'} alt={restaurant.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded">
                                            {restaurant.priceRange || '$$'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 truncate">{restaurant.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine?.join(', ')}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-xs text-gray-400">{restaurant.venue?.name}</span>
                                            {restaurant.rating > 0 && (
                                                <span className="text-brand-500 font-bold text-sm">★ {restaurant.rating}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No restaurants found in {selectedCity.name} yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantsPage;

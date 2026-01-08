import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchRestaurants } from '../api';
import { Filter, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';
import Loader from '../components/Loader';

const RestaurantsPage = () => {
    const { selectedCity } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

    const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Continental', 'Japanese'];
    const priceRanges = ['$', '$$', '$$$', '$$$$'];

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

    const toggleFilter = (value, filterArray, setFilterArray) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter(item => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => {
        if (selectedCuisines.length > 0 && !restaurant.cuisine?.some(c => selectedCuisines.includes(c))) return false;
        if (selectedPriceRanges.length > 0 && !selectedPriceRanges.includes(restaurant.priceRange)) return false;
        return true;
    });

    const clearFilters = () => {
        setSelectedCuisines([]);
        setSelectedPriceRanges([]);
    };

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-xl border sticky top-20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Filter size={20} />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>
                            {(selectedCuisines.length > 0 || selectedPriceRanges.length > 0) && (
                                <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <FilterSection title="Cuisine">
                            {cuisines.map(cuisine => (
                                <Checkbox
                                    key={cuisine}
                                    label={cuisine}
                                    checked={selectedCuisines.includes(cuisine)}
                                    onChange={() => toggleFilter(cuisine, selectedCuisines, setSelectedCuisines)}
                                />
                            ))}
                        </FilterSection>

                        <FilterSection title="Price Range">
                            {priceRanges.map(price => (
                                <Checkbox
                                    key={price}
                                    label={price}
                                    checked={selectedPriceRanges.includes(price)}
                                    onChange={() => toggleFilter(price, selectedPriceRanges, setSelectedPriceRanges)}
                                />
                            ))}
                        </FilterSection>
                    </div>
                </div>

                {/* Restaurants Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <UtensilsCrossed className="text-brand-500" />
                        Restaurants in {selectedCity.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                        Showing {filteredRestaurants.length} of {restaurants.length} restaurants
                    </p>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRestaurants.map(restaurant => (
                                <Link to={`/restaurants/${restaurant._id}`} key={restaurant._id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-52 bg-gray-200 overflow-hidden">
                                        <img src={restaurant.image || 'https://placehold.co/400x300'} alt={restaurant.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 mb-1">{restaurant.title}</h3>
                                        <p className="text-sm text-gray-500">{restaurant.cuisine?.join(', ')}</p>
                                        <p className="text-sm font-semibold text-brand-600 mt-2">{restaurant.priceRange}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No restaurants match your filters. Try adjusting the filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantsPage;

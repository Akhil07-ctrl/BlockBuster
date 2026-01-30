import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchRestaurants } from '../api';
import { Filter, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox, FilterDrawer } from '../components/FilterComponents';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import Loader from '../components/Loader';
import { handleImageError } from '../utils/imageUtils';

const RestaurantsPage = () => {
    const { selectedCity } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter states
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

    const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Continental', 'Japanese'];
    const priceRangeMapping = {
        '$': 'Under ₹500',
        '$$': '₹500 - ₹1000',
        '$$$': '₹1000 - ₹2000',
        '$$$$': 'Above ₹2000'
    };
    const priceRanges = Object.keys(priceRangeMapping);

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
        setShowMobileFilters(false);
        window.location.reload();
    };

    if (!selectedCity) return (
        <Motion.div
            className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Motion.div className="text-center">
                <UtensilsCrossed size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-semibold">Please select a city first.</p>
            </Motion.div>
        </Motion.div>
    );

    if (loading) return <Loader />;

    return (
        <Motion.div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <Motion.div
                    className="mb-12"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Motion.div
                            className="p-3 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl text-white shadow-lg"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            <UtensilsCrossed size={32} />
                        </Motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                                Restaurants
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">in {selectedCity.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-brand-600">{filteredRestaurants.length}</span> of <span className="font-bold">{restaurants.length}</span> restaurants
                    </p>

                    {/* Mobile Filter Toggle */}
                    <Motion.button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow-md transition-all"
                        whileTap={{ scale: 0.98 }}
                    >
                        <Filter size={18} className="text-brand-600" />
                        Filters
                        {(selectedCuisines.length > 0 || selectedPriceRanges.length > 0) && (
                            <span className="bg-brand-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                                {selectedCuisines.length + selectedPriceRanges.length}
                            </span>
                        )}
                    </Motion.button>
                </Motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <FilterDrawer
                        isOpen={showMobileFilters}
                        onClose={() => setShowMobileFilters(false)}
                        onClear={clearFilters}
                        hasAppliedFilters={selectedCuisines.length > 0 || selectedPriceRanges.length > 0}
                    >
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <FilterSection title="Cuisine">
                                {cuisines.map((cuisine, i) => (
                                    <Motion.div
                                        key={cuisine}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.02 }}
                                    >
                                        <Checkbox
                                            label={cuisine}
                                            checked={selectedCuisines.includes(cuisine)}
                                            onChange={() => toggleFilter(cuisine, selectedCuisines, setSelectedCuisines)}
                                        />
                                    </Motion.div>
                                ))}
                            </FilterSection>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <FilterSection title="Price Range">
                                {priceRanges.map((price, i) => (
                                    <Motion.div
                                        key={price}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.02 }}
                                    >
                                        <Checkbox
                                            label={priceRangeMapping[price]}
                                            checked={selectedPriceRanges.includes(price)}
                                            onChange={() => toggleFilter(price, selectedPriceRanges, setSelectedPriceRanges)}
                                        />
                                    </Motion.div>
                                ))}
                            </FilterSection>
                        </Motion.div>
                    </FilterDrawer>

                    {/* Restaurants Grid */}
                    <Motion.div
                        className="flex-1"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {filteredRestaurants.length > 0 ? (
                                <Motion.div
                                    key="restaurants-grid"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.05
                                            }
                                        }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredRestaurants.map(restaurant => (
                                        <Motion.div
                                            key={restaurant._id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <Link to={`/restaurants/${restaurant._id}`} className="group block h-full">
                                                <Motion.div
                                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md group-hover:shadow-xl transition-all h-full flex flex-col"
                                                    whileHover={{ y: -4 }}
                                                >
                                                    <div className="h-52 bg-gray-200 overflow-hidden relative">
                                                        <Motion.img
                                                            src={restaurant.image || 'https://placehold.co/400x300'}
                                                            alt={restaurant.title}
                                                            className="w-full h-full object-cover"
                                                            whileHover={{ scale: 1.05 }}
                                                            onError={(e) => handleImageError(e, 'restaurant')}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute top-3 right-3 bg-brand-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                                                            {priceRangeMapping[restaurant.priceRange] || restaurant.priceRange}
                                                        </div>
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 mb-2 line-clamp-1 transition-colors">
                                                            {restaurant.title}
                                                        </h3>
                                                        <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                                                            {restaurant.cuisine?.join(', ')}
                                                        </p>
                                                        <div className="mt-auto flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <Star size={14} fill="currentColor" className="text-yellow-400" />
                                                                <span className="text-sm font-bold text-gray-700">{restaurant.rating || '4.2'}</span>
                                                            </div>
                                                            <Motion.span
                                                                className="text-brand-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                                whileHover={{ x: 2 }}
                                                            >
                                                                View Menu →
                                                            </Motion.span>
                                                        </div>
                                                    </div>
                                                </Motion.div>
                                            </Link>
                                        </Motion.div>
                                    ))}
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="no-restaurants"
                                    className="col-span-full p-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <UtensilsCrossed size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-600 font-semibold mb-2">No restaurants match your filters</p>
                                    <p className="text-gray-500 text-sm">Try adjusting your filter selections</p>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </Motion.div>
                </div>
            </div>
        </Motion.div>
    );
};

export default RestaurantsPage;

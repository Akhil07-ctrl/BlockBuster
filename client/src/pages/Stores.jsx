import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchStores } from '../api';
import { Filter, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';
import Loader from '../components/Loader';

const StoresPage = () => {
    const { selectedCity } = useLocation();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = ['Fashion', 'Electronics', 'Books', 'Home Decor', 'Sports', 'Groceries'];

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

    const toggleFilter = (value, filterArray, setFilterArray) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter(item => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const filteredStores = stores.filter(store => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(store.category)) return false;
        return true;
    });

    const clearFilters = () => {
        setSelectedCategories([]);
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
                            {selectedCategories.length > 0 && (
                                <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <FilterSection title="Category">
                            {categories.map(category => (
                                <Checkbox
                                    key={category}
                                    label={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                                />
                            ))}
                        </FilterSection>
                    </div>
                </div>

                {/* Stores Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag className="text-brand-500" />
                        Stores in {selectedCity.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                        Showing {filteredStores.length} of {stores.length} stores
                    </p>

                    {filteredStores.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStores.map(store => (
                                <Link to={`/stores/${store._id}`} key={store._id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-52 bg-gray-200 overflow-hidden">
                                        <img src={store.image || 'https://placehold.co/400x300'} alt={store.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 mb-1">{store.title}</h3>
                                        <p className="text-sm text-gray-500">{store.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No stores match your filters. Try adjusting the filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoresPage;

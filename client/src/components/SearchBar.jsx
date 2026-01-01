import { useState, useEffect, useRef } from 'react';
import { globalSearch } from '../api';
import { Search, X, Film, Calendar, UtensilsCrossed, ShoppingBag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';

const SearchBar = () => {
    const { selectedCity } = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch();
            } else {
                setResults(null);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, selectedCity]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const { data } = await globalSearch(query, selectedCity?.slug);
            setResults(data);
            setIsOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults(null);
        setIsOpen(false);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'movies': return <Film size={16} />;
            case 'events': return <Calendar size={16} />;
            case 'restaurants': return <UtensilsCrossed size={16} />;
            case 'stores': return <ShoppingBag size={16} />;
            case 'activities': return <Zap size={16} />;
            default: return null;
        }
    };

    const getCategoryRoute = (category, id) => {
        return `/${category}/${id}`;
    };

    return (
        <div ref={searchRef} className="relative flex-1 max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search for Movies, Events, Restaurants, Stores, Activities..."
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-brand-500"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && results && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {loading && (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    )}

                    {!loading && results.total === 0 && (
                        <div className="p-4 text-center text-gray-500">No results found</div>
                    )}

                    {!loading && results.total > 0 && (
                        <div className="py-2">
                            {/* Movies */}
                            {results.movies.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        {getCategoryIcon('movies')} Movies
                                    </div>
                                    {results.movies.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={getCategoryRoute('movies', item._id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            {item.genre && <div className="text-xs text-gray-500">{item.genre.join(', ')}</div>}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Events */}
                            {results.events.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        {getCategoryIcon('events')} Events
                                    </div>
                                    {results.events.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={getCategoryRoute('events', item._id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            {item.city && <div className="text-xs text-gray-500">{item.city.name}</div>}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Restaurants */}
                            {results.restaurants.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        {getCategoryIcon('restaurants')} Restaurants
                                    </div>
                                    {results.restaurants.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={getCategoryRoute('restaurants', item._id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            {item.cuisine && <div className="text-xs text-gray-500">{item.cuisine.join(', ')}</div>}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Activities */}
                            {results.activities.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        {getCategoryIcon('activities')} Activities
                                    </div>
                                    {results.activities.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={getCategoryRoute('activities', item._id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            {item.city && <div className="text-xs text-gray-500">{item.city.name}</div>}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Stores */}
                            {results.stores.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                        {getCategoryIcon('stores')} Stores
                                    </div>
                                    {results.stores.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={getCategoryRoute('stores', item._id)}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            {item.category && <div className="text-xs text-gray-500">{item.category}</div>}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;

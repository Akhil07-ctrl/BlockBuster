import { useState, useEffect, useRef, useCallback } from 'react';
import { globalSearch } from '../api';
import { Search, X, Film, Calendar, UtensilsCrossed, ShoppingBag, Zap, ArrowRight, Loader as LoaderIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
    const { selectedCity } = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const searchRef = useRef(null);

    const placeholders = [
        "Search for 'Inception'",
        "Search for 'Sunburn'",
        "Search for 'Barbeque Nation'",
        "Search for 'Ramoji Film City'",
        "Search for 'Pantaloons'",
        "Search for 'Sky Lounge'",
        "Search for 'Salaar'",
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(intervalId);
    }, [placeholders.length]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = useCallback(async () => {
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
    }, [query, selectedCity]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch();
            } else {
                setResults(null);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, selectedCity, performSearch]);

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

    const resultVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.03 }
        })
    };

    const categoryVariants = {
        hidden: { opacity: 0 },
        visible: (i) => ({
            opacity: 1,
            transition: { delay: i * 0.1 }
        })
    };

    return (
        <div ref={searchRef} className="relative flex-1 max-w-md w-full">
            {/* Search Input Container */}
            <Motion.div
                className="relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Motion.div
                    className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/0 to-brand-500/0 rounded-xl group-hover:from-brand-500/10 group-hover:via-purple-500/10 group-hover:to-brand-500/10 transition-all duration-300 pointer-events-none"
                    initial={false}
                ></Motion.div>

                <div className="relative flex items-center">
                    <Motion.div
                        className="absolute left-4 text-gray-400 group-focus-within:text-brand-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                    >
                        <Search size={18} />
                    </Motion.div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                        className="w-full bg-white border border-gray-300 hover:border-brand-400 focus:border-brand-500 focus:outline-none rounded-xl py-2.5 pl-12 pr-12 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-brand-500/10"
                    />

                    <div className="absolute left-12 right-12 pointer-events-none overflow-hidden h-5 flex items-center">
                        <AnimatePresence mode="wait">
                            {!query && (
                                <Motion.span
                                    key={placeholderIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="text-gray-400 text-sm font-medium truncate"
                                >
                                    {placeholders[placeholderIndex]}
                                </Motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {query && (
                            <Motion.button
                                onClick={clearSearch}
                                className="absolute right-4 text-gray-400 hover:text-gray-600"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <X size={18} />
                            </Motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </Motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {isOpen && results && (
                    <Motion.div
                        variants={resultVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-200/50 max-h-[28rem] overflow-y-auto z-50"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {loading && (
                            <Motion.div
                                className="p-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="inline-block mb-4 text-brand-600"
                                >
                                    <LoaderIcon size={32} />
                                </Motion.div>
                                <p className="text-gray-500 font-medium">Searching...</p>
                            </Motion.div>
                        )}

                        {!loading && results.total === 0 && (
                            <Motion.div
                                className="p-8 text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
                                    <Search size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No results found for "{query}"</p>
                                <p className="text-sm text-gray-500 mt-1">Try different keywords</p>
                            </Motion.div>
                        )}

                        {!loading && results.total > 0 && (
                            <div className="py-3">
                                {/* Movies */}
                                {results.movies.length > 0 && (
                                    <SearchCategory
                                        title="Movies"
                                        icon={getCategoryIcon('movies')}
                                        items={results.movies}
                                        route="movies"
                                        getSubtitle={(item) => item.genre?.join(', ')}
                                        onSelect={() => setIsOpen(false)}
                                        itemVariants={itemVariants}
                                        categoryVariants={categoryVariants}
                                        index={0}
                                    />
                                )}

                                {/* Events */}
                                {results.events.length > 0 && (
                                    <SearchCategory
                                        title="Events"
                                        icon={getCategoryIcon('events')}
                                        items={results.events}
                                        route="events"
                                        getSubtitle={(item) => item.city?.name}
                                        onSelect={() => setIsOpen(false)}
                                        itemVariants={itemVariants}
                                        categoryVariants={categoryVariants}
                                        index={1}
                                    />
                                )}

                                {/* Restaurants */}
                                {results.restaurants.length > 0 && (
                                    <SearchCategory
                                        title="Restaurants"
                                        icon={getCategoryIcon('restaurants')}
                                        items={results.restaurants}
                                        route="restaurants"
                                        getSubtitle={(item) => item.cuisine?.join(', ')}
                                        onSelect={() => setIsOpen(false)}
                                        itemVariants={itemVariants}
                                        categoryVariants={categoryVariants}
                                        index={2}
                                    />
                                )}

                                {/* Activities */}
                                {results.activities.length > 0 && (
                                    <SearchCategory
                                        title="Activities"
                                        icon={getCategoryIcon('activities')}
                                        items={results.activities}
                                        route="activities"
                                        getSubtitle={(item) => item.city?.name}
                                        onSelect={() => setIsOpen(false)}
                                        itemVariants={itemVariants}
                                        categoryVariants={categoryVariants}
                                        index={3}
                                    />
                                )}

                                {/* Stores */}
                                {results.stores.length > 0 && (
                                    <SearchCategory
                                        title="Stores"
                                        icon={getCategoryIcon('stores')}
                                        items={results.stores}
                                        route="stores"
                                        getSubtitle={(item) => item.category}
                                        onSelect={() => setIsOpen(false)}
                                        itemVariants={itemVariants}
                                        categoryVariants={categoryVariants}
                                        index={4}
                                    />
                                )}
                            </div>
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SearchCategory = ({
    title,
    icon,
    items,
    route,
    getSubtitle,
    onSelect,
    itemVariants,
    categoryVariants,
    index
}) => (
    <Motion.div
        custom={index}
        variants={categoryVariants}
        initial="hidden"
        animate="visible"
        className="border-b border-gray-100/50 last:border-b-0"
    >
        <div className="px-4 py-2 flex items-center gap-2">
            <div className="text-brand-600">{icon}</div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        </div>
        <div className="px-2 pb-2 space-y-1">
            {items.map((item, i) => (
                <Motion.div
                    key={item._id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link
                        to={`/${route}/${item._id}`}
                        onClick={onSelect}
                        className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/60 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate group-hover:text-brand-600 transition-colors">
                                {item.title}
                            </div>
                            {getSubtitle(item) && (
                                <div className="text-xs text-gray-500 truncate">
                                    {getSubtitle(item)}
                                </div>
                            )}
                        </div>
                        <Motion.div
                            className="ml-2 text-gray-400 group-hover:text-brand-600 transition-colors opacity-0 group-hover:opacity-100"
                            whileHover={{ x: 4 }}
                        >
                            <ArrowRight size={16} />
                        </Motion.div>
                    </Link>
                </Motion.div>
            ))}
        </div>
    </Motion.div>
);

export default SearchBar;

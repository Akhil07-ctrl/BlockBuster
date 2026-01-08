import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies } from '../api';
import { Filter, Film, X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import { handleImageError } from '../utils/imageUtils';

const MovieCard = ({ movie }) => (
    <Motion.div
        variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    duration: 0.5,
                    ease: 'easeOut'
                }
            }
        }}
    >
        <Link to={`/movies/${movie._id}`} className="group block h-full">
            <Motion.div
                className="relative rounded-2xl overflow-hidden shadow-lg mb-4 aspect-[3/4] bg-gray-200"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <img
                    src={movie.poster || 'https://placehold.co/300x450'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'movie')}
                    loading="lazy"
                />
                <Motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80"
                    transition={{ duration: 0.3 }}
                ></Motion.div>

                {movie.rating && (
                    <Motion.div
                        className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Star size={12} fill="currentColor" className="text-yellow-400" />
                        {movie.rating}
                    </Motion.div>
                )}

                <Motion.div
                    className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Motion.button
                        className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-bold text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Book Now
                    </Motion.button>
                </Motion.div>
            </Motion.div>

            <Motion.div whileHover={{ y: -2 }}>
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors mb-1">
                    {movie.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                    {movie.genre?.join(', ')}
                </p>
            </Motion.div>
        </Link>
    </Motion.div>
);

const MoviesPage = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter states
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [selectedCertificates, setSelectedCertificates] = useState([]);

    const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi'];
    const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam'];
    const certificates = ['U', 'UA', 'A', 'S'];

    useEffect(() => {
        const getMovies = async () => {
            if (!selectedCity) return;
            try {
                const { data } = await fetchMovies(selectedCity.slug);
                setMovies(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getMovies();
    }, [selectedCity]);

    const toggleFilter = (value, filterArray, setFilterArray) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter(item => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const filteredMovies = movies.filter(movie => {
        if (selectedGenres.length > 0 && !movie.genre?.some(g => selectedGenres.includes(g))) return false;
        if (selectedLanguages.length > 0 && !selectedLanguages.includes(movie.language)) return false;
        if (selectedCertificates.length > 0 && !selectedCertificates.includes(movie.certificate)) return false;
        return true;
    });

    const clearFilters = () => {
        setSelectedGenres([]);
        setSelectedLanguages([]);
        setSelectedCertificates([]);
    };

    if (!selectedCity) return (
        <Motion.div
            className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Motion.div className="text-center">
                <Film size={48} className="mx-auto mb-4 text-gray-400" />
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
                            <Film size={32} />
                        </Motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                                Movies
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">in {selectedCity.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-brand-600">{filteredMovies.length}</span> of <span className="font-bold">{movies.length}</span> movies
                    </p>

                    {/* Mobile Filter Toggle */}
                    <Motion.button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow-md transition-all"
                        whileTap={{ scale: 0.98 }}
                    >
                        <Filter size={18} className="text-brand-600" />
                        Filters
                        {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedCertificates.length > 0) && (
                            <span className="bg-brand-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                                {selectedGenres.length + selectedLanguages.length + selectedCertificates.length}
                            </span>
                        )}
                    </Motion.button>
                </Motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <AnimatePresence>
                        {(showMobileFilters || window.innerWidth >= 1024) && (
                            <Motion.div
                                className={`fixed lg:relative inset-0 lg:inset-auto z-[60] lg:z-0 lg:w-64 shrink-0 ${showMobileFilters ? 'flex' : 'hidden lg:block'}`}
                                initial={window.innerWidth < 1024 ? { opacity: 0 } : false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Mobile Backdrop */}
                                <div
                                    className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowMobileFilters(false)}
                                />

                                <Motion.div
                                    className="relative bg-white w-[280px] lg:w-full h-full lg:h-auto rounded-r-3xl lg:rounded-2xl border-r lg:border border-gray-200 overflow-hidden shadow-2xl lg:shadow-lg sticky top-0 lg:top-24 flex flex-col"
                                    initial={window.innerWidth < 1024 ? { x: -280 } : false}
                                    animate={{ x: 0 }}
                                    exit={{ x: -280 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                >
                                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-purple-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Filter size={20} className="text-brand-600" />
                                            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AnimatePresence>
                                                {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedCertificates.length > 0) && (
                                                    <Motion.button
                                                        onClick={clearFilters}
                                                        className="text-brand-600 text-sm font-bold hover:text-brand-700 transition-colors"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Clear
                                                    </Motion.button>
                                                )}
                                            </AnimatePresence>
                                            <button
                                                onClick={() => setShowMobileFilters(false)}
                                                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <X size={20} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6 overflow-y-auto">
                                        <Motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                        >
                                            <FilterSection title="Genre">
                                                {genres.map((genre, i) => (
                                                    <Motion.div
                                                        key={genre}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.15 + i * 0.02 }}
                                                    >
                                                        <Checkbox
                                                            label={genre}
                                                            checked={selectedGenres.includes(genre)}
                                                            onChange={() => toggleFilter(genre, selectedGenres, setSelectedGenres)}
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
                                            <FilterSection title="Language">
                                                {languages.map((lang, i) => (
                                                    <Motion.div
                                                        key={lang}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.25 + i * 0.02 }}
                                                    >
                                                        <Checkbox
                                                            label={lang}
                                                            checked={selectedLanguages.includes(lang)}
                                                            onChange={() => toggleFilter(lang, selectedLanguages, setSelectedLanguages)}
                                                        />
                                                    </Motion.div>
                                                ))}
                                            </FilterSection>
                                        </Motion.div>

                                        <Motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <FilterSection title="Certificate">
                                                {certificates.map((cert, i) => (
                                                    <Motion.div
                                                        key={cert}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.35 + i * 0.02 }}
                                                    >
                                                        <Checkbox
                                                            label={cert}
                                                            checked={selectedCertificates.includes(cert)}
                                                            onChange={() => toggleFilter(cert, selectedCertificates, setSelectedCertificates)}
                                                        />
                                                    </Motion.div>
                                                ))}
                                            </FilterSection>
                                        </Motion.div>
                                    </div>
                                </Motion.div>
                            </Motion.div>
                        )}
                    </AnimatePresence>

                    {/* Movies Grid */}
                    <Motion.div
                        className="flex-1"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {filteredMovies.length > 0 ? (
                                <Motion.div
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
                                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                                >
                                    {filteredMovies.map((movie, i) => (
                                        <MovieCard key={movie._id} movie={movie} index={i} />
                                    ))}
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    className="col-span-full p-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Film size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-600 font-semibold mb-2">No movies match your filters</p>
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

export default MoviesPage;

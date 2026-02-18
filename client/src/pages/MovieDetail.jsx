import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchMovieById } from '../api';
import { Calendar, Clock, Star, Film, Play, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';
import TrailerModal from '../components/TrailerModal';
import { handleImageError } from '../utils/imageUtils';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCity } = useLocation();
    const [movie, setMovie] = useState(null);
    const [initialCity, setInitialCity] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [activeTrailer, setActiveTrailer] = useState(null);

    const { isWishlisted, toggle } = useWishlist(id, 'Movie');

    useEffect(() => {
        const getMovie = async () => {
            try {
                const { data } = await fetchMovieById(id);
                setMovie(data);
                if (!initialCity && selectedCity) {
                    setInitialCity(selectedCity.slug);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getMovie();
    }, [id, initialCity, selectedCity]);

    // Navigate to home when city changes
    useEffect(() => {
        if (initialCity && selectedCity && selectedCity.slug !== initialCity) {
            navigate('/');
        }
    }, [selectedCity, initialCity, navigate]);

    if (!movie) {
        return (
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center"
            >
                <div className="text-center">
                    <Motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                    >
                        <Film size={64} className="text-brand-500 mb-4" />
                    </Motion.div>
                    <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white text-lg"
                    >
                        Loading movie details...
                    </Motion.p>
                </div>
            </Motion.div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden"
        >
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                ></Motion.div>
                <Motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                ></Motion.div>
            </div>

            {/* Backdrop Banner */}
            <Motion.div
                className="relative h-[30vh] sm:h-96 w-full bg-gray-800 overflow-hidden"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {movie.backdrop ? (
                    <Motion.img
                        src={movie.backdrop}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                        onError={(e) => handleImageError(e, 'movie')}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
                        <Film size={64} className="text-gray-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </Motion.div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-16 sm:-mt-32 relative">
                    {/* Poster */}
                    <Motion.div
                        className="md:col-span-1 max-w-[280px] md:max-w-none mx-auto w-full"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Motion.div
                            whileHover={{ y: -8, rotateY: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="relative"
                        >
                            <img
                                src={movie.poster || 'https://placehold.co/300x450'}
                                alt={movie.title}
                                className="w-full rounded-2xl shadow-2xl border border-white/10"
                                onError={(e) => handleImageError(e, 'movie')}
                                loading="lazy"
                            />
                            <Motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0"
                                whileHover={{ opacity: 1 }}
                            ></Motion.div>
                        </Motion.div>
                    </Motion.div>

                    {/* Movie Details */}
                    <Motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Motion.h1
                            className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-brand-300 to-brand-400 bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {movie.title}
                        </Motion.h1>

                        {/* Metadata Row */}
                        <Motion.div
                            className="flex flex-wrap gap-3 mb-8 text-sm md:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {movie.rating > 0 && (
                                <Motion.div
                                    className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 rounded-full text-white font-bold shadow-lg shadow-brand-500/30"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                >
                                    <Star size={16} fill="currentColor" className="text-yellow-300" />
                                    <span>{movie.rating}/10</span>
                                    {movie.votes > 0 && <span className="text-xs opacity-75">({movie.votes})</span>}
                                </Motion.div>
                            )}
                            {movie.certificate && (
                                <Motion.span
                                    className="bg-gray-700/80 backdrop-blur-md px-4 py-2 rounded-full font-bold border border-gray-600"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {movie.certificate}
                                </Motion.span>
                            )}
                            {movie.duration && (
                                <Motion.div
                                    className="flex items-center gap-2 text-gray-300 bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Clock size={16} />
                                    <span>{movie.duration} mins</span>
                                </Motion.div>
                            )}
                            {movie.releaseDate && (
                                <Motion.div
                                    className="flex items-center gap-2 text-gray-300 bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Calendar size={16} />
                                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                </Motion.div>
                            )}
                        </Motion.div>

                        {/* Genre */}
                        {movie.genre && movie.genre.length > 0 && (
                            <Motion.div
                                className="mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {movie.genre.map((g, idx) => (
                                        <Motion.span
                                            key={idx}
                                            className="bg-gray-800/60 backdrop-blur-md border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-200 font-medium"
                                            whileHover={{ scale: 1.05, borderColor: '#f97316' }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            {g}
                                        </Motion.span>
                                    ))}
                                </div>
                            </Motion.div>
                        )}

                        {/* Language */}
                        {movie.language && (
                            <Motion.div
                                className="mb-8 flex items-center gap-3 text-gray-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div className="p-2 bg-brand-500/20 rounded-lg">
                                    <Film size={20} className="text-brand-400" />
                                </div>
                                <span className="font-medium text-white text-lg">{movie.language}</span>
                            </Motion.div>
                        )}

                        {/* Description */}
                        {movie.description && (
                            <Motion.div
                                className="mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <h3 className="text-2xl font-bold mb-4 text-white">Overview</h3>
                                <p className="text-gray-400 text-base leading-relaxed">{movie.description}</p>
                            </Motion.div>
                        )}

                        {/* Action Buttons */}
                        <Motion.div
                            className="flex flex-col sm:flex-row gap-4 mb-12 relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={`/movies/${movie._id}/showtimes`}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-600/40"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 15h0" /><path d="M2 12h20" /><path d="M7 8h0" /></svg>
                                    Book Tickets
                                </Link>
                            </Motion.div>

                            <Motion.button
                                onClick={toggle}
                                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 ${isWishlisted ? 'bg-brand-500/10 border-brand-500 text-brand-500' : 'border-gray-600 text-gray-300 hover:border-brand-500 hover:text-white'}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                                {isWishlisted ? 'In Hotlist' : 'Add to Hotlist'}
                            </Motion.button>


                        </Motion.div>

                        {/* Watch Trailer if available */}
                        {(movie.trailerUrl || (movie.trailers && movie.trailers.length > 0)) && (
                            <Motion.div
                                className="mb-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <div className="flex flex-wrap gap-4">
                                    {movie.trailerUrl && (
                                        <Motion.button
                                            onClick={() => {
                                                setActiveTrailer({ url: movie.trailerUrl, title: 'Official Trailer' });
                                                setIsTrailerOpen(true);
                                            }}
                                            className="inline-flex items-center justify-center gap-2 text-brand-400 hover:text-brand-300 font-bold transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <Play size={20} fill="currentColor" />
                                            Watch Official Trailer
                                        </Motion.button>
                                    )}

                                    {movie.trailers?.map((trailer, idx) => (
                                        <Motion.button
                                            key={trailer._id || idx}
                                            onClick={() => {
                                                setActiveTrailer(trailer);
                                                setIsTrailerOpen(true);
                                            }}
                                            className="inline-flex items-center justify-center gap-2 text-brand-400 hover:text-brand-300 font-bold transition-colors"
                                            whileHover={{ x: 5 }}
                                        >
                                            <Play size={20} fill="currentColor" />
                                            {trailer.title || `Watch Trailer ${idx + 1}`}
                                        </Motion.button>
                                    ))}
                                </div>
                            </Motion.div>
                        )}

                        {/* Cast */}
                        {movie.cast && movie.cast.length > 0 && (
                            <Motion.div
                                className="border-t border-gray-700 pt-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                            >
                                <h2 className="text-2xl font-bold mb-8 text-white">Top Cast</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    {movie.cast.map((member, idx) => (
                                        <Motion.div
                                            key={idx}
                                            className="flex flex-col items-center text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08 }}
                                        >
                                            <Motion.div
                                                className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-brand-500/50 bg-gray-800 shadow-lg"
                                                whileHover={{ scale: 1.1, borderColor: '#f97316' }}
                                            >
                                                <img
                                                    src={member.image || 'https://placehold.co/150'}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => handleImageError(e, 'movie')}
                                                    loading="lazy"
                                                />
                                            </Motion.div>
                                            <Motion.p
                                                className="font-semibold text-white text-sm"
                                                whileHover={{ color: '#f97316' }}
                                            >
                                                {member.name}
                                            </Motion.p>
                                            {member.role && <p className="text-xs text-gray-500 mt-1">{member.role}</p>}
                                        </Motion.div>
                                    ))}
                                </div>
                            </Motion.div>
                        )}
                    </Motion.div>
                </div>
            </div>

            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={activeTrailer?.url}
                title={activeTrailer?.title}
            />
        </Motion.div>
    );
};

export default MovieDetail;

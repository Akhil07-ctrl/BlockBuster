import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Clock, Star, Play, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!movie) return <div className="h-screen flex items-center justify-center">Movie not found</div>;

    return (
        <div className="bg-neutral-900 min-h-screen text-white pb-20">
            {/* Backdrop */}
            <div
                className="h-[400px] md:h-[500px] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl mx-auto md:mx-0 shrink-0"
                    >
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1 pt-4 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm md:text-base text-gray-300 mb-6">
                            {movie.rating > 0 && (
                                <span className="flex items-center gap-1 text-brand-500 font-bold">
                                    <Star size={18} fill="currentColor" /> {movie.rating}/10
                                </span>
                            )}
                            <span className="flex items-center gap-1"><Clock size={18} /> {movie.duration} min</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded">{movie.certificate}</span>
                            <span>{movie.language}</span>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                            {movie.genre.map(g => (
                                <span key={g} className="border border-gray-600 rounded-full px-3 py-1 text-xs">{g}</span>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate(`/movies/${id}/booking`)}
                            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-brand-500/20 transition-all w-full md:w-auto"
                        >
                            Book Tickets
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-12 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4">About the Movie</h2>
                    <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                </div>

                {/* Cast Placeholder */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Cast</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {/* Mock Cast if empty */}
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-2"></div>
                            <p className="text-sm font-medium">Actor Name</p>
                            <p className="text-xs text-gray-400">Role</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;

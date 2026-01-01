import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchMovieById } from '../api';
import { Calendar, Clock, Star, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCity } = useLocation();
    const [movie, setMovie] = useState(null);
    const [initialCity, setInitialCity] = useState(null);

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
    }, [id]);

    // Navigate to home when city changes
    useEffect(() => {
        if (initialCity && selectedCity && selectedCity.slug !== initialCity) {
            navigate('/');
        }
    }, [selectedCity, initialCity, navigate]);

    if (!movie) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen">
            {/* Backdrop Banner */}
            {movie.backdrop && (
                <div className="relative h-96 w-full">
                    <img
                        src={movie.backdrop}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
                    {/* Poster */}
                    <div className="md:col-span-1">
                        <img
                            src={movie.poster || 'https://via.placeholder.com/300x450'}
                            alt={movie.title}
                            className="w-full rounded-xl shadow-2xl"
                        />
                    </div>

                    {/* Movie Details */}
                    <div className="md:col-span-2 text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {movie.rating > 0 && (
                                <div className="flex items-center gap-2 bg-brand-500 px-3 py-1 rounded-full">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold">{movie.rating}/10</span>
                                    {movie.votes > 0 && <span className="text-sm">({movie.votes} votes)</span>}
                                </div>
                            )}
                            {movie.certificate && (
                                <span className="bg-gray-700 px-3 py-1 rounded-full font-bold">{movie.certificate}</span>
                            )}
                            {movie.duration && (
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{movie.duration} mins</span>
                                </div>
                            )}
                            {movie.releaseDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                </div>
                            )}
                        </div>

                        {/* Genre */}
                        {movie.genre && movie.genre.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {movie.genre.map((g, idx) => (
                                        <span key={idx} className="border border-gray-400 px-3 py-1 rounded-full text-sm">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Language */}
                        {movie.language && (
                            <p className="mb-4 flex items-center gap-2">
                                <Film size={18} />
                                <span>{movie.language}</span>
                            </p>
                        )}

                        {/* Description */}
                        {movie.description && (
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">{movie.description}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <Link
                                to={`/movies/${movie._id}/booking`}
                                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                            >
                                Book Tickets
                            </Link>
                            {movie.trailerUrl && (
                                <a
                                    href={movie.trailerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-bold text-lg transition-colors"
                                >
                                    Watch Trailer
                                </a>
                            )}
                        </div>

                        {/* Cast */}
                        {movie.cast && movie.cast.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {movie.cast.map((member, idx) => (
                                        <div key={idx} className="text-center">
                                            <img
                                                src={member.image || 'https://via.placeholder.com/150'}
                                                alt={member.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-gray-600"
                                            />
                                            <p className="font-semibold">{member.name}</p>
                                            {member.role && <p className="text-sm text-gray-400">{member.role}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;

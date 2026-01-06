import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchScreenings, fetchMovieById } from '../api';
import { MapPin, Calendar, Clock, ChevronRight, Info } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import Loader from '../components/Loader';

const MovieShowtimes = () => {
    const { id } = useParams(); // This is the movie ID
    const navigate = useNavigate();
    const { selectedCity } = useLocation();
    const [movie, setMovie] = useState(null);
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            if (!selectedCity) return;
            setLoading(true);
            try {
                // 1. Get Movie Details (to get slug)
                const { data: movieData } = await fetchMovieById(id);
                setMovie(movieData);

                // 2. Get Screenings
                const { data: screeningsData } = await fetchScreenings(movieData.slug, selectedCity.slug);
                setScreenings(screeningsData.screenings);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [id, selectedCity]);

    if (loading) return <Loader />;
    if (!movie) return <div className="p-10 text-center">Movie not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{movie.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                            <MapPin size={14} className="text-brand-500" />
                            {selectedCity?.name}
                        </span>
                        {movie.certificate && (
                            <span className="px-3 py-1 border-2 border-gray-200 rounded-full">{movie.certificate}</span>
                        )}
                        {movie.language && (
                            <span className="px-3 py-1 border-2 border-gray-200 rounded-full">{movie.language}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {screenings.length === 0 ? (
                    <div className="bg-white rounded-3xl border p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No shows available</h2>
                        <p className="text-gray-500">There are no screenings scheduled for this movie in {selectedCity?.name} currently.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {screenings.map((screening) => (
                            <Motion.div 
                                key={screening._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-50">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">{screening.venue.name}</h3>
                                                <p className="text-gray-500 text-sm font-medium">{screening.venue.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <button className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700">
                                                <Info size={14} />
                                                INFO
                                            </button>
                                            <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                M-TICKET AVAILABLE
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {screening.screens.map((screen, sIdx) => (
                                            <div key={sIdx} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                <div className="md:col-span-1">
                                                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                                        {screen.language} • {screen.formats.join(', ')}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900">{screen.screenName}</div>
                                                </div>
                                                <div className="md:col-span-3 flex flex-wrap gap-3">
                                                    {screen.shows.map((show, showIdx) => {
                                                        const showTime = typeof show === 'object' ? show.time : show;
                                                        return (
                                                            <Link
                                                                key={showIdx}
                                                                to={`/movies/${movie._id}/booking?venueId=${screening.venue._id}&showtime=${showTime}&price=${screen.price}&screen=${screen.screenName}&date=${new Date().toISOString().split('T')[0]}`}
                                                                className="group flex flex-col items-center justify-center min-w-[100px] p-3 border-2 border-gray-100 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all text-center"
                                                            >
                                                                <span className="text-sm font-black text-gray-900 group-hover:text-brand-600">{showTime}</span>
                                                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">₹{screen.price}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieShowtimes;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { fetchScreenings, fetchMovieById } from '../api';
import { MapPin, Calendar, Info } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import Loader from '../components/Loader';

const MovieShowtimes = () => {
    const { id } = useParams(); // This is the movie ID
    const { selectedCity } = useLocation();
    const [movie, setMovie] = useState(null);
    const [screenings, setScreenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate dates: 10 active days + 4 transparent "anticipation" days
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            date,
            isAnticipate: i >= 10,
            id: date.toISOString().split('T')[0]
        };
    });

    const formatDate = (date) => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()]
        };
    };

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

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
                console.log('Screenings Response:', screeningsData);
                
                // Handle different potential response structures
                let screeningsList = [];
                if (Array.isArray(screeningsData)) {
                    screeningsList = screeningsData;
                } else if (screeningsData && screeningsData.screenings) {
                    screeningsList = screeningsData.screenings;
                }
                
                setScreenings(screeningsList);
            } catch (err) {
                console.error('Fetch Error:', err);
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

                {/* Date Selector */}
                <div className="border-t">
                    <div className="container mx-auto px-4">
                        <div className="flex overflow-x-auto no-scrollbar py-4 gap-2">
                            {dates.map((item) => {
                                const dateInfo = formatDate(item.date);
                                const isSelected = isSameDay(item.date, selectedDate);
                                
                                return (
                                    <button
                                        key={item.id}
                                        disabled={item.isAnticipate}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-1 rounded-xl transition-all ${
                                            isSelected 
                                                ? 'bg-brand-500 text-white shadow-lg shadow-brand-200' 
                                                : item.isAnticipate
                                                    ? 'opacity-20 cursor-not-allowed grayscale'
                                                    : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-brand-100' : 'text-gray-400'}`}>
                                            {dateInfo.day}
                                        </span>
                                        <span className="text-lg font-black leading-tight">
                                            {dateInfo.date}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-brand-100' : 'text-gray-400'}`}>
                                            {dateInfo.month}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {!screenings || screenings.length === 0 ? (
                    <div className="bg-white rounded-3xl border p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No shows available</h2>
                        <p className="text-gray-500">There are no screenings scheduled for this movie in {selectedCity?.name} currently.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {screenings.map((screening) => {
                            // Provide fallback for venue/theatre if populated data is missing
                            const venueName = screening.venue?.name || screening.theatre?.name || 'Unknown Cinema';
                            const venueAddress = screening.venue?.address || screening.theatre?.location || 'Address not available';
                            const venueId = screening.venue?._id || screening.theatre?._id || screening._id || '';
                            
                            return (
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
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">{venueName}</h3>
                                                <p className="text-gray-500 text-sm font-medium">{venueAddress}</p>
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
                                        {(!screening.screens || screening.screens.length === 0) ? (
                                            <p className="text-center text-gray-400 py-4 font-medium italic">No screens scheduled for this venue.</p>
                                        ) : (
                                            screening.screens.map((screen, sIdx) => (
                                                <div key={sIdx} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                    <div className="md:col-span-1">
                                                        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                                            {screen.language} • {screen.formats?.join(', ') || '2D'}
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-900">{screen.screenName}</div>
                                                    </div>
                                                    <div className="md:col-span-3 flex flex-wrap gap-3">
                                                        {(!screen.shows || screen.shows.length === 0) ? (
                                                            <p className="text-xs text-gray-400">No timings available</p>
                                                        ) : (
                                                            screen.shows.map((show, showIdx) => {
                                                                const showTime = typeof show === 'object' ? show.time : show;
                                                                return (
                                                                    <Link
                                                                        key={showIdx}
                                                                        to={`/movies/${movie._id}/booking?venueId=${venueId}&showtime=${showTime}&price=${screen.price}&screen=${screen.screenName}&date=${selectedDate.toISOString().split('T')[0]}`}
                                                                        className="group flex flex-col items-center justify-center min-w-[100px] p-3 border-2 border-gray-100 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all text-center"
                                                                    >
                                                                        <span className="text-sm font-black text-gray-900 group-hover:text-brand-600">{showTime}</span>
                                                                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">₹{screen.price}</span>
                                                                    </Link>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </Motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieShowtimes;

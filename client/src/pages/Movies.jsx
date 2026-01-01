import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies } from '../api';
import { Filter } from 'lucide-react';

const MoviesPage = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading movies...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar (Placeholder for now) */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-xl border opacity-70 pointer-events-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <p className="text-sm text-gray-500">Language, Genre, Format filtering coming soon.</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6">Movies in {selectedCity.name}</h2>

                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {movies.map(movie => (
                                <div key={movie._id} className="group cursor-pointer">
                                    <div className="rounded-xl overflow-hidden shadow-sm mb-3 h-[360px] bg-gray-200 relative">
                                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-white">
                                            <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded">
                                                {movie.rating > 0 ? `★ ${movie.rating}` : 'New'}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 truncate">{movie.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{movie.genre.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No movies found specifically for this city yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviesPage;

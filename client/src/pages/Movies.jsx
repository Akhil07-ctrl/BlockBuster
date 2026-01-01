import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies } from '../api';
import { Filter, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';

const MoviesPage = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading movies...</div>;

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
                            {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedCertificates.length > 0) && (
                                <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <FilterSection title="Genre">
                            {genres.map(genre => (
                                <Checkbox
                                    key={genre}
                                    label={genre}
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => toggleFilter(genre, selectedGenres, setSelectedGenres)}
                                />
                            ))}
                        </FilterSection>

                        <FilterSection title="Language">
                            {languages.map(lang => (
                                <Checkbox
                                    key={lang}
                                    label={lang}
                                    checked={selectedLanguages.includes(lang)}
                                    onChange={() => toggleFilter(lang, selectedLanguages, setSelectedLanguages)}
                                />
                            ))}
                        </FilterSection>

                        <FilterSection title="Certificate">
                            {certificates.map(cert => (
                                <Checkbox
                                    key={cert}
                                    label={cert}
                                    checked={selectedCertificates.includes(cert)}
                                    onChange={() => toggleFilter(cert, selectedCertificates, setSelectedCertificates)}
                                />
                            ))}
                        </FilterSection>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Film className="text-brand-500" />
                        Movies in {selectedCity.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                        Showing {filteredMovies.length} of {movies.length} movies
                    </p>

                    {filteredMovies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredMovies.map(movie => (
                                <Link to={`/movies/${movie._id}`} key={movie._id} className="group cursor-pointer">
                                    <div className="rounded-xl overflow-hidden shadow-md mb-3 h-[300px] bg-gray-200">
                                        <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 truncate">{movie.title}</h3>
                                    <p className="text-sm text-gray-500">{movie.genre?.join(', ')}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No movies match your filters. Try adjusting the filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MoviesPage;

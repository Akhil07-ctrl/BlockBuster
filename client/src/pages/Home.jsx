import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies, fetchEvents, fetchRestaurants, fetchStores, fetchActivities } from '../api';
import { Link } from 'react-router-dom';
import { Film, Calendar, UtensilsCrossed, ShoppingBag, Zap } from 'lucide-react';

const CategorySection = ({ title, icon: Icon, data, route, renderCard }) => (
    <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Icon className="text-brand-500" />
                {title}
            </h2>
            <Link to={route} className="text-brand-600 font-medium hover:underline">See All ›</Link>
        </div>

        {data.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {data.slice(0, 5).map(renderCard)}
            </div>
        ) : (
            <div className="text-gray-400 italic">No {title.toLowerCase()} available in this city.</div>
        )}
    </section>
);

const Home = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [events, setEvents] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [stores, setStores] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedCity) {
            setLoading(true);
            Promise.all([
                fetchMovies(selectedCity.slug).then(res => setMovies(res.data)),
                fetchEvents(selectedCity.slug).then(res => setEvents(res.data)),
                fetchRestaurants(selectedCity.slug).then(res => setRestaurants(res.data)),
                fetchStores(selectedCity.slug).then(res => setStores(res.data)),
                fetchActivities(selectedCity.slug).then(res => setActivities(res.data))
            ])
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [selectedCity]);

    if (!selectedCity) {
        return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Please select a city to view content</div>;
    }

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to <span className="text-brand-500">BlockBuster</span> in {selectedCity.name}
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">Discover the best movies, events, dining, shopping, and activities.</p>
                </div>
            </section>

            {/* Movies Section */}
            <CategorySection
                title="Recommended Movies"
                icon={Film}
                data={movies}
                route="/movies"
                renderCard={(movie) => (
                    <Link to={`/movies/${movie._id}`} key={movie._id} className="group cursor-pointer">
                        <div className="rounded-xl overflow-hidden shadow-md mb-3 h-[300px] bg-gray-200">
                            <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 truncate">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.genre?.join(', ')}</p>
                    </Link>
                )}
            />

            {/* Events Section */}
            <div className="bg-gray-50">
                <CategorySection
                    title="Events Nearby"
                    icon={Calendar}
                    data={events}
                    route="/events"
                    renderCard={(event) => (
                        <Link to={`/events/${event._id}`} key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all">
                            <div className="h-40 bg-gray-200">
                                <img src={event.image || 'https://via.placeholder.com/400x300'} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{event.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{event.venue?.name}</p>
                                <p className="text-brand-600 font-bold">₹{event.price}</p>
                            </div>
                        </Link>
                    )}
                />
            </div>

            {/* Restaurants Section */}
            <CategorySection
                title="Popular Restaurants"
                icon={UtensilsCrossed}
                data={restaurants}
                route="/restaurants"
                renderCard={(restaurant) => (
                    <Link to={`/restaurants/${restaurant._id}`} key={restaurant._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all">
                        <div className="h-40 bg-gray-200">
                            <img src={restaurant.image || 'https://via.placeholder.com/400x300'} alt={restaurant.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1 truncate">{restaurant.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{restaurant.cuisine?.join(', ')}</p>
                        </div>
                    </Link>
                )}
            />

            {/* Activities Section */}
            <div className="bg-gray-50">
                <CategorySection
                    title="Adventure Activities"
                    icon={Zap}
                    data={activities}
                    route="/activities"
                    renderCard={(activity) => (
                        <Link to={`/activities/${activity._id}`} key={activity._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all">
                            <div className="h-40 bg-gray-200">
                                <img src={activity.image || 'https://via.placeholder.com/400x300'} alt={activity.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{activity.title}</h3>
                                <p className="text-brand-600 font-bold">₹{activity.price}</p>
                            </div>
                        </Link>
                    )}
                />
            </div>

            {/* Stores Section */}
            <CategorySection
                title="Shopping & Stores"
                icon={ShoppingBag}
                data={stores}
                route="/stores"
                renderCard={(store) => (
                    <Link to={`/stores/${store._id}`} key={store._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all">
                        <div className="h-40 bg-gray-200">
                            <img src={store.image || 'https://via.placeholder.com/400x300'} alt={store.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1 truncate">{store.title}</h3>
                            <p className="text-sm text-gray-500 truncate">{store.category}</p>
                        </div>
                    </Link>
                )}
            />
        </div>
    );
};

export default Home;

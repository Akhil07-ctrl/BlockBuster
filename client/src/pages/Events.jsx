import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchEvents } from '../api';
import { Filter } from 'lucide-react';

const EventsPage = () => {
    const { selectedCity } = useLocation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            if (!selectedCity) return;
            try {
                const { data } = await fetchEvents(selectedCity.slug);
                setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getEvents();
    }, [selectedCity]);

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading events...</div>;

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
                        <p className="text-sm text-gray-500">Date, Category, Price filtering coming soon.</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6">Events in {selectedCity.name}</h2>

                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {events.map(event => (
                                <div key={event._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-gray-100">
                                    <div className="h-48 bg-gray-200 relative">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded uppercase tracking-wider">
                                            {event.category}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 truncate">{event.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{event.venue?.name}, {event.city?.name}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <p className="text-brand-600 font-bold text-lg">₹{event.price}</p>
                                            <button className="text-brand-600 bg-brand-50 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-brand-100 transition-colors">
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No events found specifically for this city yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsPage;

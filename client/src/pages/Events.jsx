import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchEvents } from '../api';
import { Filter, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';

const EventsPage = () => {
    const { selectedCity } = useLocation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedTypes, setSelectedTypes] = useState([]);

    const eventTypes = ['Concert', 'Festival', 'Conference', 'Exhibition', 'Workshop', 'Sports'];

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

    const toggleFilter = (value, filterArray, setFilterArray) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter(item => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const filteredEvents = events.filter(event => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) return false;
        return true;
    });

    const clearFilters = () => {
        setSelectedTypes([]);
    };

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading events...</div>;

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
                            {selectedTypes.length > 0 && (
                                <button onClick={clearFilters} className="text-brand-600 text-sm font-medium hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <FilterSection title="Event Type">
                            {eventTypes.map(type => (
                                <Checkbox
                                    key={type}
                                    label={type}
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                                />
                            ))}
                        </FilterSection>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="text-brand-500" />
                        Events in {selectedCity.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-4">
                        Showing {filteredEvents.length} of {events.length} events
                    </p>

                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <Link to={`/events/${event._id}`} key={event._id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="h-52 bg-gray-200 overflow-hidden">
                                        <img src={event.image || 'https://via.placeholder.com/400x300'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 mb-1">{event.title}</h3>
                                        <p className="text-sm text-gray-500">{event.venue?.name}</p>
                                        <p className="text-sm font-semibold text-brand-600 mt-2">₹{event.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No events match your filters. Try adjusting the filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsPage;

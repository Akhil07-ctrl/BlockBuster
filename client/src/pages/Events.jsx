import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchEvents } from '../api';
import { Filter, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox } from '../components/FilterComponents';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';

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

    if (!selectedCity) return (
        <Motion.div 
            className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Motion.div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-semibold">Please select a city first.</p>
            </Motion.div>
        </Motion.div>
    );
    if (loading) return <Loader />;

    return (
        <Motion.div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <Motion.div
                    className="mb-12"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <Motion.div
                            className="p-3 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl text-white shadow-lg"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                            <Calendar size={32} />
                        </Motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                                Events
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">in {selectedCity.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-brand-600">{filteredEvents.length}</span> of <span className="font-bold">{events.length}</span> events
                    </p>
                </Motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <Motion.div 
                        className="w-full lg:w-64 shrink-0"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <Motion.div 
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg sticky top-24"
                            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-purple-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Filter size={20} className="text-brand-600" />
                                        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                                    </div>
                                    <AnimatePresence>
                                        {selectedTypes.length > 0 && (
                                            <Motion.button 
                                                onClick={clearFilters} 
                                                className="text-brand-600 text-sm font-bold hover:text-brand-700 transition-colors"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                Clear
                                            </Motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="p-6">
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
                        </Motion.div>
                    </Motion.div>

                    {/* Events Grid */}
                    <Motion.div 
                        className="flex-1"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {filteredEvents.length > 0 ? (
                                <Motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.05 }
                                        }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredEvents.map(event => (
                                        <Motion.div
                                            key={event._id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <Link to={`/events/${event._id}`} className="group block h-full">
                                                <Motion.div
                                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md group-hover:shadow-xl transition-all h-full flex flex-col"
                                                    whileHover={{ y: -4 }}
                                                >
                                                    <div className="h-48 bg-gray-200 overflow-hidden">
                                                        <Motion.img 
                                                            src={event.image || 'https://placehold.co/400x300'} 
                                                            alt={event.title} 
                                                            className="w-full h-full object-cover"
                                                            whileHover={{ scale: 1.05 }}
                                                        />
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <Motion.h3 
                                                            className="font-bold text-gray-900 group-hover:text-brand-600 mb-2 line-clamp-2"
                                                            whileHover={{ x: 4 }}
                                                        >
                                                            {event.title}
                                                        </Motion.h3>
                                                        <p className="text-sm text-gray-600 mb-4 flex-1">{event.venue?.name}</p>
                                                        <p className="text-lg font-black bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">₹{event.price}</p>
                                                    </div>
                                                </Motion.div>
                                            </Link>
                                        </Motion.div>
                                    ))}
                                </Motion.div>
                            ) : (
                                <Motion.div 
                                    className="col-span-full p-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-600 font-semibold mb-2">No events match your filters</p>
                                    <p className="text-gray-500 text-sm">Try adjusting your filter selections</p>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </Motion.div>
                </div>
            </div>
        </Motion.div>
    );
};

export default EventsPage;

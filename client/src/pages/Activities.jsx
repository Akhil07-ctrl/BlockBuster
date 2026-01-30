import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchActivities } from '../api';
import { Filter, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterSection, Checkbox, FilterDrawer } from '../components/FilterComponents';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { handleImageError } from '../utils/imageUtils';

import Loader from '../components/Loader';

const ActivitiesPage = () => {
    const { selectedCity } = useLocation();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter states
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);

    const activityTypes = ['Adventure', 'Sports', 'Workshop', 'Wellness', 'Outdoor'];
    const difficulties = ['Easy', 'Moderate', 'Hard'];

    useEffect(() => {
        const getActivities = async () => {
            if (!selectedCity) return;
            try {
                const { data } = await fetchActivities(selectedCity.slug);
                setActivities(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getActivities();
    }, [selectedCity]);

    const toggleFilter = (value, filterArray, setFilterArray) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter(item => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const filteredActivities = activities.filter(activity => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(activity.type)) return false;
        if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(activity.difficulty)) return false;
        return true;
    });

    const clearFilters = () => {
        setSelectedTypes([]);
        setSelectedDifficulties([]);
        setShowMobileFilters(false);
        window.location.reload();
    };

    if (!selectedCity) return (
        <Motion.div
            className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Motion.div className="text-center">
                <Compass size={48} className="mx-auto mb-4 text-gray-400" />
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
                            <Compass size={32} />
                        </Motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                                Activities
                            </h1>
                            <p className="text-gray-600 font-medium mt-1">in {selectedCity.name}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Showing <span className="font-bold text-brand-600">{filteredActivities.length}</span> of <span className="font-bold">{activities.length}</span> activities
                    </p>

                    {/* Mobile Filter Toggle */}
                    <Motion.button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-gray-700 shadow-sm hover:shadow-md transition-all"
                        whileTap={{ scale: 0.98 }}
                    >
                        <Filter size={18} className="text-brand-600" />
                        Filters
                        {(selectedTypes.length > 0 || selectedDifficulties.length > 0) && (
                            <span className="bg-brand-600 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">
                                {selectedTypes.length + selectedDifficulties.length}
                            </span>
                        )}
                    </Motion.button>
                </Motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <FilterDrawer
                        isOpen={showMobileFilters}
                        onClose={() => setShowMobileFilters(false)}
                        onClear={clearFilters}
                        hasAppliedFilters={selectedTypes.length > 0 || selectedDifficulties.length > 0}
                    >
                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <FilterSection title="Category">
                                {activityTypes.map((type, i) => (
                                    <Motion.div
                                        key={type}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + i * 0.02 }}
                                    >
                                        <Checkbox
                                            label={type}
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                                        />
                                    </Motion.div>
                                ))}
                            </FilterSection>
                        </Motion.div>

                        <Motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <FilterSection title="Difficulty">
                                {difficulties.map((diff, i) => (
                                    <Motion.div
                                        key={diff}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.02 }}
                                    >
                                        <Checkbox
                                            label={diff}
                                            checked={selectedDifficulties.includes(diff)}
                                            onChange={() => toggleFilter(diff, selectedDifficulties, setSelectedDifficulties)}
                                        />
                                    </Motion.div>
                                ))}
                            </FilterSection>
                        </Motion.div>
                    </FilterDrawer>

                    {/* Activities Grid */}
                    <Motion.div
                        className="flex-1"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {filteredActivities.length > 0 ? (
                                <Motion.div
                                    key="activities-grid"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.05
                                            }
                                        }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredActivities.map(activity => (
                                        <Motion.div
                                            key={activity._id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <Link to={`/activities/${activity._id}`} className="group block h-full">
                                                <Motion.div
                                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md group-hover:shadow-xl transition-all h-full flex flex-col"
                                                    whileHover={{ y: -4 }}
                                                >
                                                    <div className="h-52 bg-gray-200 overflow-hidden relative">
                                                        <Motion.img
                                                            src={activity.image || 'https://placehold.co/400x300'}
                                                            alt={activity.title}
                                                            className="w-full h-full object-cover"
                                                            whileHover={{ scale: 1.05 }}
                                                            onError={(e) => handleImageError(e, 'activity')}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                            {activity.difficulty}
                                                        </div>
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-600 mb-2 line-clamp-2 transition-colors">
                                                            {activity.title}
                                                        </h3>
                                                        <p className="text-gray-500 text-sm mb-4 line-clamp-1">{activity.type}</p>
                                                        <div className="mt-auto flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase">Starting from</span>
                                                                <p className="text-lg font-black bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">₹{activity.price}</p>
                                                            </div>
                                                            <Motion.button
                                                                className="px-4 py-2 bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-brand-600 rounded-xl text-xs font-bold transition-colors border border-gray-100 hover:border-brand-200"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Details
                                                            </Motion.button>
                                                        </div>
                                                    </div>
                                                </Motion.div>
                                            </Link>
                                        </Motion.div>
                                    ))}
                                </Motion.div>
                            ) : (
                                <Motion.div
                                    key="no-activities"
                                    className="col-span-full p-12 bg-white rounded-2xl border-2 border-dashed border-gray-300 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Compass size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-600 font-semibold mb-2">No activities match your filters</p>
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

export default ActivitiesPage;

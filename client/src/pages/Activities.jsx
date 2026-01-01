import { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchActivities } from '../api';
import { Filter, Zap } from 'lucide-react';

const ActivitiesPage = () => {
    const { selectedCity } = useLocation();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (!selectedCity) return <div className="p-10 text-center">Please select a city first.</div>;
    if (loading) return <div className="p-10 text-center">Loading activities...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-xl border opacity-70 pointer-events-none">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter size={20} />
                            <h3 className="font-bold text-lg">Filters</h3>
                        </div>
                        <p className="text-sm text-gray-500">Type, Difficulty filtering coming soon.</p>
                    </div>
                </div>

                <div className="w-full md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="text-brand-500" />
                        Activities in {selectedCity.name}
                    </h2>

                    {activities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map(activity => (
                                <div key={activity._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transition-all border border-gray-100 group cursor-pointer">
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img src={activity.image || 'https://via.placeholder.com/400x300'} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        {activity.difficulty && (
                                            <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded">
                                                {activity.difficulty}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 truncate">{activity.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{activity.type}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-brand-600 font-bold">₹{activity.price}</span>
                                            {activity.duration && (
                                                <span className="text-xs text-gray-400">{activity.duration}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 bg-gray-50 rounded-xl text-center text-gray-500">
                            No activities found in {selectedCity.name} yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivitiesPage;

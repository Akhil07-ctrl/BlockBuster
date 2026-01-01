import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { fetchActivityById, createBooking, verifyPayment } from '../api';
import { MapPin, Clock, DollarSign, Users, AlertCircle, Minus, Plus } from 'lucide-react';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [participants, setParticipants] = useState(1);

    useEffect(() => {
        const getActivity = async () => {
            try {
                const { data } = await fetchActivityById(id);
                setActivity(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getActivity();
    }, [id]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleBooking = async () => {
        if (!user) {
            alert('Please sign in to book this activity');
            navigate('/sign-in');
            return;
        }

        setProcessing(true);

        try {
            const { data } = await createBooking({
                userId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                entityId: activity._id,
                entityType: 'Activity',
                venueId: activity.venue?._id,
                quantity: participants,
                totalAmount: participants * activity.price
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'BlockBuster',
                description: `Activity: ${activity.title}`,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: data.booking._id
                        });
                        navigate('/booking/success');
                    } catch (err) {
                        alert('Payment verification failed');
                        console.error(err);
                    }
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || ''
                },
                theme: {
                    color: '#ef4444'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert('Failed to initiate payment');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!activity) return <div className="p-10 text-center">Activity not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div>
                    <img
                        src={activity.image || 'https://via.placeholder.com/600x400'}
                        alt={activity.title}
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">{activity.title}</h1>

                    <div className="flex items-center gap-3 mb-4">
                        {activity.type && (
                            <span className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {activity.type}
                            </span>
                        )}
                        {activity.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    activity.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {activity.difficulty}
                            </span>
                        )}
                    </div>

                    {activity.description && (
                        <p className="text-gray-600 mb-6">{activity.description}</p>
                    )}

                    <div className="space-y-3 mb-6">
                        {activity.venue && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin size={20} className="text-brand-500" />
                                <span>{activity.venue.name}{activity.city && `, ${activity.city.name}`}</span>
                            </div>
                        )}

                        {activity.duration && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Clock size={20} className="text-brand-500" />
                                <span>Duration: {activity.duration}</span>
                            </div>
                        )}

                        {activity.groupSize && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <Users size={20} className="text-brand-500" />
                                <span>Group Size: {activity.groupSize}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign size={20} className="text-brand-500" />
                            <span className="font-bold text-brand-600">₹{activity.price} per person</span>
                        </div>
                    </div>

                    {activity.inclusions && activity.inclusions.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">What's Included:</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {activity.inclusions.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activity.requirements && activity.requirements.length > 0 && (
                        <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={18} className="text-yellow-600" />
                                <h3 className="font-bold text-yellow-900">Requirements:</h3>
                            </div>
                            <ul className="list-disc list-inside text-yellow-800 space-y-1">
                                {activity.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Booking */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-bold text-lg mb-4">Book this Activity</h3>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700">Number of Participants:</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-xl w-8 text-center">{participants}</span>
                                <button
                                    onClick={() => setParticipants(participants + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-lg">
                            <span>Total:</span>
                            <span className="font-bold text-brand-600">₹{participants * activity.price}</span>
                        </div>
                        <button
                            onClick={handleBooking}
                            disabled={processing}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-bold transition-colors"
                        >
                            {processing ? 'Processing...' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;

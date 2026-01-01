import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const BookingSuccess = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                <CheckCircle size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8 max-w-md">Your tickets have been booked successfully. We have sent the details to your email.</p>

            <Link to="/" className="bg-brand-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-brand-600 transition-colors">
                Back to Home
            </Link>
        </div>
    );
};

export default BookingSuccess;

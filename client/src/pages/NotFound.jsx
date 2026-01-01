import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-gray-100">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-brand-600 mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <Home size={20} />
                        Go to Homepage
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 border-2 border-brand-500 text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <Search size={20} />
                        Explore Content
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

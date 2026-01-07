import { motion as Motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                        <ScrollText size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Terms of <span className="text-brand-600">Service</span>
                    </h1>
                    <p className="text-gray-500">Last updated: January 2024</p>
                </Motion.div>

                <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 prose prose-brand max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            By accessing and using BlockBuster, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            You are responsible for maintaining the confidentiality of your account credentials.
                            Any activity performed under your account is your sole responsibility.
                            You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Booking & Payments</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            All bookings are subject to availability. Prices are dynamic and may change without notice.
                            Payments are processed securely through third-party providers. By making a booking,
                            you agree to pay all associated fees.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            The content, logo, and technology behind BlockBuster are the property of BlockBuster Entertainment.
                            You may not reproduce, distribute, or modify any part of our platform without explicit permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            BlockBuster acts as an intermediary for entertainment discovery and booking.
                            We are not responsible for the quality of service provided by third-party venues
                            (cinemas, restaurants, etc.).
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;

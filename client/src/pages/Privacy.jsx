import { motion as Motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Privacy <span className="text-brand-600">Policy</span>
                    </h1>
                    <p className="text-gray-500">Last updated: January 2024</p>
                </Motion.div>

                <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 prose prose-brand max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            We collect information that you provide directly to us, such as your name, email address, and
                            payment details when you make a booking. We also collect data automatically about your
                            interactions with our platform to improve your experience.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Data</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            Your data is used to process bookings, provide customer support, and personalize content
                            recommendations. We may use your contact information to send you updates about your bookings
                            and promotional offers (which you can opt out of).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            We share necessary information with our partners (like cinemas or event venues) to fulfill
                            your bookings. We never sell your personal information to third parties for marketing purposes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Rights</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            You have the right to access, correct, or delete your personal data. You can manage
                            your preferences in your account settings or contact our support team for assistance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                        <p className="text-gray-600 leading-relaxed max-w-none">
                            We use cookies to maintain your session and understand how you use our site.
                            You can control cookie settings through your browser, but some features of
                            BlockBuster may not function correctly without them.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;

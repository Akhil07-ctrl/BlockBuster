import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('https://formspree.io/f/xgovgyzl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Form submission error:', err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
                        Get in <span className="text-brand-600">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Have questions or feedback? We'd love to hear from you.
                        Our team is here to help you 24/7.
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                                <p className="text-gray-600">support@blockbuster.com</p>
                                <p className="text-gray-600">info@blockbuster.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                                <p className="text-gray-600">+91 9872669959</p>
                                <p className="text-gray-600">Mon-Sun, 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                <p className="text-gray-600">Flat-305, Ruby Block</p>
                                <p className="text-gray-600">Kompally, Hyderabad</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <Motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            onSubmit={handleSubmit}
                            className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                        >
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <Motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Message Sent!</h3>
                                        <p className="text-gray-600 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
                                        <button
                                            type="button"
                                            onClick={() => setStatus('idle')}
                                            className="text-brand-600 font-bold uppercase tracking-widest text-xs hover:underline"
                                        >
                                            Send another message
                                        </button>
                                    </Motion.div>
                                ) : (
                                    <Motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="mb-8">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all h-32"
                                                placeholder="How can we help you?"
                                            ></textarea>
                                        </div>

                                        {status === 'error' && (
                                            <div className="mb-6 p-4 bg-red-50 rounded-xl text-red-600 flex items-center gap-3 text-sm font-medium border border-red-100">
                                                <AlertCircle size={18} />
                                                Something went wrong. Please try again.
                                            </div>
                                        )}

                                        <button
                                            disabled={status === 'loading'}
                                            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                                        >
                                            {status === 'loading' ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Send size={20} />
                                            )}
                                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                                        </button>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </Motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

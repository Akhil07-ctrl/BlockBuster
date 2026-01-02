import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
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
                </motion.div>

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
                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                <p className="text-gray-600">Mon-Sun, 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-brand-600 flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                                <p className="text-gray-600">123 Entertainment Way</p>
                                <p className="text-gray-600">Los Angeles, CA 90210</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                        >
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all h-32"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Send size={20} />
                                Send Message
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

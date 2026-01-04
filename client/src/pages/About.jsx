import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Users, Target, Shield, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
                        Redefining <span className="text-brand-600">Entertainment</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        BlockBuster is your gateway to the most extraordinary experiences in your city.
                        We bring together movies, events, dining, and more in one seamless platform.
                    </p>
                </Motion.div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                    >
                        <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                            <Target size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To empower every individual with the discovery of life's most memorable moments,
                            making entertainment accessible, personalized, and truly spectacular.
                        </p>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                    >
                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                            <Users size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To become the world's most loved entertainment companion, fostering
                            communities through shared joy and unforgettable real-world adventures.
                        </p>
                    </Motion.div>
                </div>

                {/* Values */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Shield size={24} />, title: "Trust & Security", desc: "Your safety and security are our top priorities in every transaction." },
                            { icon: <Award size={24} />, title: "Excellence", desc: "We strive for perfection in curating only the best experiences for you." },
                            { icon: <Users size={24} />, title: "Community", desc: "Building meaningful connections through shared entertainment." }
                        ].map((value, i) => (
                            <Motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-8"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-800">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

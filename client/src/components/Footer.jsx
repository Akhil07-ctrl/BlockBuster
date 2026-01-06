import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Ticket, Utensils, ShoppingBag as ShoppingIcon, Zap } from 'lucide-react';

const Footer = () => {
    return (
        <Motion.footer
            className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <Motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                ></Motion.div>
                <Motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                ></Motion.div>
            </div>

            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="container mx-auto px-4 pt-20 pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        {/* Branding */}
                        <Motion.div
                            className="sm:col-span-2 lg:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Motion.div 
                                className="flex items-center gap-3 mb-4 group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="p-2 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl shadow-lg shadow-brand-500/20">
                                    <Ticket size={28} className="text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                                <h2 className="text-4xl font-black bg-gradient-to-r from-white via-brand-300 to-brand-500 bg-clip-text text-transparent">
                                    BlockBuster
                                </h2>
                            </Motion.div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Discover the extraordinary. Your premium gateway to the city's finest entertainment, dining, and adventures awaits.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { icon: <Ticket size={18} />, label: 'Movies', path: '/movies' },
                                    { icon: <Zap size={18} />, label: 'Events', path: '/events' },
                                    { icon: <Utensils size={18} />, label: 'Dining', path: '/restaurants' },
                                    { icon: <ShoppingIcon size={18} />, label: 'Stores', path: '/stores' }
                                ].map((item) => (
                                    <Link key={item.label} to={item.path}>
                                        <Motion.div
                                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-brand-400"
                                            whileHover={{ scale: 1.1, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {item.icon}
                                        </Motion.div>
                                    </Link>
                                ))}
                            </div>
                        </Motion.div>

                        {/* Categories */}
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                                Categories
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Movies', path: '/movies' },
                                    { name: 'Events', path: '/events' },
                                    { name: 'Restaurants', path: '/restaurants' },
                                    { name: 'Stores', path: '/stores' },
                                    { name: 'Activities', path: '/activities' }
                                ].map((item) => (
                                    <Motion.li key={item.name} whileHover={{ x: 6 }}>
                                        <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                                            {item.name}
                                            <Motion.span
                                                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '100%' }}
                                                transition={{ duration: 0.3 }}
                                            ></Motion.span>
                                        </Link>
                                    </Motion.li>
                                ))}
                            </ul>
                        </Motion.div>

                        {/* Company */}
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'About Us', path: '/about' },
                                    { name: 'Contact', path: '/contact' },
                                    { name: 'FAQ', path: '/faq' }
                                ].map((item) => (
                                    <Motion.li key={item.name} whileHover={{ x: 6 }}>
                                        <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                                            {item.name}
                                            <Motion.span
                                                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '100%' }}
                                                transition={{ duration: 0.3 }}
                                            ></Motion.span>
                                        </Link>
                                    </Motion.li>
                                ))}
                            </ul>
                        </Motion.div>

                        {/* Legal */}
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-lg font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-400">
                                Legal
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Privacy Policy', path: '/privacy' },
                                    { name: 'Terms of Service', path: '/terms' }
                                ].map((item) => (
                                    <Motion.li key={item.name} whileHover={{ x: 6 }}>
                                        <Link to={item.path} className="text-gray-400 hover:text-white font-medium transition-colors relative group">
                                            {item.name}
                                            <Motion.span
                                                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-brand-400 to-purple-500"
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '100%' }}
                                                transition={{ duration: 0.3 }}
                                            ></Motion.span>
                                        </Link>
                                    </Motion.li>
                                ))}
                            </ul>
                        </Motion.div>
                    </div>

                    {/* Divider */}
                    <Motion.div
                        className="h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent mb-12"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    ></Motion.div>

                    {/* Bottom Section */}
                    <Motion.div
                        className="flex flex-col md:flex-row justify-between items-center gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} BlockBuster Entertainment. Crafted with passion for amazing experiences.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { name: 'Twitter', icon: <Twitter size={18} />, path: 'https://twitter.com' },
                                { name: 'Instagram', icon: <Instagram size={18} />, path: 'https://instagram.com' },
                                { name: 'LinkedIn', icon: <Linkedin size={18} />, path: 'https://linkedin.com' },
                                { name: 'Facebook', icon: <Facebook size={18} />, path: 'https://facebook.com' }
                            ].map((social) => (
                                <Motion.a
                                    key={social.name}
                                    href={social.path}
                                    target="_blank"
                                    className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                    whileHover={{ scale: 1.2, y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {social.icon}
                                </Motion.a>
                            ))}
                        </div>
                    </Motion.div>
                </div>
            </div>
        </Motion.footer>
    );
};

export default Footer;

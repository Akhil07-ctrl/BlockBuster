import { useEffect, useState, useRef } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies, fetchEvents, fetchRestaurants, fetchStores, fetchActivities } from '../api';
import { Link } from 'react-router-dom';
import { Film, Calendar, UtensilsCrossed, ShoppingBag, Zap, Star, Sparkles, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import PropTypes from 'prop-types';


const HeroSection = ({ city }) => {
    const ref = useRef(null);
    const heroContentRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
    const blur = useTransform(scrollYProgress, [0, 1], [2, 8]);

    return (
        <section ref={ref} className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-900 text-white pb-10">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0">
                <motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                >
                    <motion.div
                        style={{ backdropFilter: blur }}
                        className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-900/40"
                    ></motion.div>
                </motion.div>

                {/* Animated Gradient Orbs */}
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                ></motion.div>
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                ></motion.div>
            </div>

            {/* Content Fusion */}
            <motion.div
                ref={heroContentRef}
                className="container mx-auto px-4 relative z-10 text-center"
                style={{ scale }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex flex-col items-center gap-3 mb-6"
                >
                    <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-brand-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-brand-500/10">
                        <Sparkles size={14} className="text-brand-400 animate-pulse" />
                        <span>Discover the Extraordinary</span>
                    </div>
                    <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium backdrop-blur-md shadow-lg shadow-brand-500/5">
                        <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <MapPin size={14} className="text-brand-400" />
                        </motion.div>
                        Explore {city.name}
                    </span>
                </motion.div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                    Welcome to <span className="text-brand-500 relative inline-block">
                        BlockBuster
                        <motion.span
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        ></motion.span>
                    </span> in <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {city.name}
                    </span>
                </h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Discover the best movies, events, dining, shopping, and activities.
                </motion.p>
            </motion.div>
        </section>
    );
};

HeroSection.propTypes = {
    city: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
};


const PremiumCard = ({ item, link, image, subtitle, badge, badgeColor = "bg-black/60", action = "Book Now" }) => {
    return (
        <motion.div
            className="group cursor-pointer h-full"
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Link to={link} className="block h-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-200 mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img
                        src={image || 'https://via.placeholder.com/400x600'}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                    {/* Badge */}
                    {badge && (
                        <div className={`absolute top-3 right-3 ${badgeColor} backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/20`}>
                            {badge}
                        </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <button className="bg-brand-600 text-white w-full py-2.5 rounded-xl font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            {action}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-brand-600 transition-colors">
                        {item.title || item.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 line-clamp-1">
                        {subtitle || 'N/A'}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};

PremiumCard.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string,
    subtitle: PropTypes.string,
    badge: PropTypes.node,
    badgeColor: PropTypes.string,
    action: PropTypes.string,
};


const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${active
            ? 'text-white'
            : 'text-gray-500 hover:text-brand-600 hover:bg-gray-100'
            }`}
    >
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-brand-600 rounded-full shadow-lg shadow-brand-500/30"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
        )}
        <span className="relative z-10 flex items-center gap-2">
            <Icon size={18} />
            {label}
        </span>
    </button>
);

TabButton.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};


const CategoryGrid = ({ data, renderCard, title, icon: Icon }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Icon size={48} className="mb-4 opacity-20" />
                <p className="text-lg">No {title.toLowerCase()} found.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.05 } }
            }}
        >
            {data.map((item) => (
                <motion.div
                    key={item._id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    {renderCard(item)}
                </motion.div>
            ))}
        </motion.div>
    );
};

CategoryGrid.propTypes = {
    data: PropTypes.array,
    renderCard: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
};

const StackingSection = ({ id, title, icon: Icon, data, renderCard, index, active }) => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const element = sectionRef.current;
        const content = contentRef.current;

        // The stacking effect: previous sections scale down and blur as new ones cover them
        gsap.to(content, {
            scrollTrigger: {
                trigger: element,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
            scale: 0.9,
            opacity: 0.5,
            filter: "blur(10px)",
            y: -50,
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

    if (!data || data.length === 0) return null;

    return (
        <section
            id={id}
            ref={sectionRef}
            className="sticky top-0 min-h-screen bg-gray-50 flex flex-col pt-24"
            style={{ zIndex: index + 10 }}
        >
            <div
                ref={contentRef}
                className="container mx-auto px-4 flex-grow"
            >
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-12 mb-20 min-h-[70vh]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-brand-50 rounded-2xl text-brand-600">
                            <Icon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{title}</h2>
                            <div className="h-1.5 w-20 bg-brand-500 rounded-full mt-2"></div>
                        </div>
                    </div>

                    <CategoryGrid
                        title={title}
                        icon={Icon}
                        data={data}
                        renderCard={renderCard}
                    />
                </div>
            </div>
        </section>
    );
};

StackingSection.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    data: PropTypes.array,
    renderCard: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    active: PropTypes.bool
};

const Home = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [events, setEvents] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [stores, setStores] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('movies');
    const [isNavSticky, setIsNavSticky] = useState(false);

    useEffect(() => {
        if (selectedCity) {
            setLoading(true);
            Promise.all([
                fetchMovies(selectedCity.slug).then(res => setMovies(res.data)),
                fetchEvents(selectedCity.slug).then(res => setEvents(res.data)),
                fetchRestaurants(selectedCity.slug).then(res => setRestaurants(res.data)),
                fetchStores(selectedCity.slug).then(res => setStores(res.data)),
                fetchActivities(selectedCity.slug).then(res => setActivities(res.data))
            ])
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [selectedCity]);

    // Active Tab Tracking & Sticky Nav Logic
    useEffect(() => {
        const handleScroll = () => {
            const tabs = ['movies', 'events', 'restaurants', 'activities', 'stores'];

            // Check if nav should be sticky
            const heroHeight = window.innerHeight * 0.5;
            setIsNavSticky(window.scrollY > heroHeight);

            // Find active section using getBoundingClientRect
            // In a stacking layout, the active section is the last one that has reached the top
            let currentTab = tabs[0];

            for (const tab of tabs) {
                const element = document.getElementById(tab);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // We use 120 as a threshold to account for the sticky header height
                    if (rect.top <= 120) {
                        currentTab = tab;
                    }
                }
            }
            setActiveTab(currentTab);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Adjust for sticky nav height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (!selectedCity) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl text-gray-500 animate-pulse">Waiting for location...</p>
        </div>
    );

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const tabs = [
        { id: 'movies', label: 'Movies', icon: Film },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'restaurants', label: 'Dining', icon: UtensilsCrossed },
        { id: 'activities', label: 'Adventures', icon: Zap },
        { id: 'stores', label: 'Shopping', icon: ShoppingBag },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <HeroSection city={selectedCity} />

            {/* Sticky Tab Navigation */}
            <div
                className={`sticky top-16 z-[100] transition-all duration-300 ${isNavSticky
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg py-4 border-b border-gray-100'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2 overflow-x-auto no-scrollbar">
                        <div className={`flex p-1.5 rounded-2xl ${isNavSticky ? 'bg-gray-100/50' : 'bg-white shadow-xl border border-gray-100'}`}>
                            {tabs.map(tab => (
                                <TabButton
                                    key={tab.id}
                                    {...tab}
                                    active={activeTab === tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stacking Sections Area */}
            <div className="relative">
                <StackingSection
                    index={0}
                    id="movies"
                    title="Recommended Movies"
                    icon={Film}
                    data={movies}
                    active={activeTab === 'movies'}
                    renderCard={(movie) => (
                        <PremiumCard
                            item={movie}
                            link={`/movies/${movie._id}`}
                            image={movie.poster}
                            subtitle={movie.genre?.slice(0, 2).join(', ')}
                            badge={movie.rating > 0 && <span className="flex items-center gap-1"><Star size={10} fill="currentColor" className="text-yellow-400" />{movie.rating}</span>}
                        />
                    )}
                />

                <StackingSection
                    index={1}
                    id="events"
                    title="Trending Events"
                    icon={Calendar}
                    data={events}
                    active={activeTab === 'events'}
                    renderCard={(event) => (
                        <PremiumCard
                            item={event}
                            link={`/events/${event._id}`}
                            image={event.image}
                            subtitle={event.venue?.name}
                            badge={event.price ? `₹${event.price}` : 'Free'}
                            badgeColor="bg-brand-600"
                        />
                    )}
                />

                <StackingSection
                    index={2}
                    id="restaurants"
                    title="Premium Dining"
                    icon={UtensilsCrossed}
                    data={restaurants}
                    active={activeTab === 'restaurants'}
                    renderCard={(restaurant) => (
                        <PremiumCard
                            item={restaurant}
                            link={`/restaurants/${restaurant._id}`}
                            image={restaurant.image}
                            subtitle={restaurant.cuisine?.join(', ')}
                            badge={restaurant.rating > 0 && `${restaurant.rating} ★`}
                            action="Reserve Table"
                        />
                    )}
                />

                <StackingSection
                    index={3}
                    id="activities"
                    title="Exciting Adventures"
                    icon={Zap}
                    data={activities}
                    active={activeTab === 'activities'}
                    renderCard={(activity) => (
                        <PremiumCard
                            item={activity}
                            link={`/activities/${activity._id}`}
                            image={activity.image}
                            subtitle={activity.type}
                            badge={`₹${activity.price}`}
                            badgeColor="bg-green-600"
                        />
                    )}
                />

                <StackingSection
                    index={4}
                    id="stores"
                    title="Premium Shopping"
                    icon={ShoppingBag}
                    data={stores}
                    active={activeTab === 'stores'}
                    renderCard={(store) => (
                        <PremiumCard
                            item={store}
                            link={`/stores/${store._id}`}
                            image={store.image}
                            subtitle={store.category}
                            action="Visit Store"
                        />
                    )}
                />
            </div>

            {/* Space at the bottom so the last section can be scrolled through */}
            <div className="h-screen bg-transparent pointer-events-none"></div>
        </div>
    );
};

export default Home;


import { useEffect, useState, useRef } from 'react';
import { useLocation } from '../context/LocationContext';
import { fetchMovies, fetchEvents, fetchRestaurants, fetchStores, fetchActivities } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Film, Calendar, UtensilsCrossed, ShoppingBag, Zap, Star, Sparkles, MapPin } from 'lucide-react';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import Loader from '../components/Loader';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { handleImageError } from '../utils/imageUtils';

const CategoryCarousel = ({ data, renderCard }) => {
    return (
        <div className="md:hidden py-4 overflow-visible">
            <Swiper
                slidesPerView={1.3}
                centeredSlides={true}
                spaceBetween={20}
                grabCursor={true}
                resistanceRatio={0.5}
                touchRatio={1.2}
                className="category-swiper !overflow-visible"
            >
                {data.map((item) => (
                    <SwiperSlide key={item._id}>
                        {({ isActive }) => (
                            <Motion.div
                                animate={{
                                    scale: isActive ? 1 : 0.85,
                                    opacity: isActive ? 1 : 0.6
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderCard(item)}
                            </Motion.div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};


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
                <Motion.div
                    style={{ y, opacity }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')] bg-cover bg-center"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                >
                    <Motion.div
                        style={{ backdropFilter: blur }}
                        className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-900/40"
                    ></Motion.div>
                </Motion.div>

                {/* Animated Gradient Orbs */}
                <Motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                ></Motion.div>
                <Motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                ></Motion.div>
            </div>

            {/* Content Fusion */}
            <Motion.div
                ref={heroContentRef}
                className="container mx-auto px-4 relative z-10 text-center"
                style={{ scale }}
            >
                <Motion.div
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
                        <Motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <MapPin size={14} className="text-brand-400" />
                        </Motion.div>
                        Explore {city.name}
                    </span>
                </Motion.div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                    Welcome to <span className="text-brand-500 relative inline-block">
                        BlockBuster
                        <Motion.span
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        ></Motion.span>
                    </span> in <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {city.name}
                    </span>
                </h1>

                <Motion.p
                    className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Discover the best movies, events, dining, shopping, and activities.
                </Motion.p>
            </Motion.div>
        </section>
    );
};

HeroSection.propTypes = {
    city: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
};


const PremiumCard = ({ item, link, image, subtitle, badge, badgeColor = "bg-black/60", action = "Book Now" }) => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        if (!isSignedIn) {
            navigate('/sign-in');
        } else {
            navigate(link);
        }
    };

    return (
        <Motion.div
            className="group cursor-pointer h-full"
            whileHover={{
                y: -12,
                transition: { type: 'spring', stiffness: 400, damping: 17 }
            }}
            onClick={handleClick}
        >
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-200 mb-4 shadow-md group-hover:shadow-2xl group-hover:shadow-brand-500/20 transition-all duration-500">
                <img
                    src={image || 'https://placehold.co/400x600'}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        // Determine entity type from link path
                        const entityType = link.split('/')[1]?.slice(0, -1) || 'generic';
                        handleImageError(e, entityType);
                    }}
                    loading="lazy"
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
        </Motion.div>
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


const CategoryGrid = ({ data, renderCard, title, icon: Icon, limit = 5 }) => {
    const displayData = data?.slice(0, limit) || [];

    if (!displayData || displayData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Icon size={48} className="mb-4 opacity-20" />
                <p className="text-lg">No {title.toLowerCase()} found.</p>
            </div>
        );
    }

    return (
        <Motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.05 } }
            }}
        >
            {displayData.map((item) => (
                <Motion.div
                    key={item._id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                >
                    {renderCard(item)}
                </Motion.div>
            ))}
        </Motion.div>
    );
};

CategoryGrid.propTypes = {
    data: PropTypes.array,
    renderCard: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    limit: PropTypes.number,
};

const HomeSection = ({ id, title, icon: Icon, data, renderCard, viewAllPath }) => {
    if (!data || data.length === 0) return null;

    return (
        <section id={id} className="py-20 bg-white scroll-mt-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-brand-50 rounded-2xl text-brand-600">
                            <Icon size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{title}</h2>
                            <div className="h-1.5 w-20 bg-brand-500 rounded-full mt-2"></div>
                        </div>
                    </div>

                    {viewAllPath && (
                        <Link
                            to={viewAllPath}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-brand-500/20"
                        >
                            See All {title.split(' ').pop()}
                            <Zap size={16} className="ml-2 fill-current" />
                        </Link>
                    )}
                </div>

                <CategoryCarousel data={data} renderCard={renderCard} />

                <div className="hidden md:block">
                    <CategoryGrid
                        title={title}
                        icon={Icon}
                        data={data}
                        renderCard={renderCard}
                        limit={5}
                    />
                </div>
            </div>
        </section>
    );
};

HomeSection.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    data: PropTypes.array,
    renderCard: PropTypes.func.isRequired,
    viewAllPath: PropTypes.string,
};

const QuickNav = ({ activeSection }) => {
    const categories = [
        { id: 'movies', name: 'Movies', icon: Film, color: 'text-brand-500', bg: 'bg-brand-50' },
        { id: 'events', name: 'Events', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'dining', name: 'Dining', icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'activities', name: 'Adventures', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-50' },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Dispatch event for SmoothScroll (Lenis) to handle
            // Offset -140 accounts for Header (64px) + QuickNav (~60px) + Breathing room
            window.dispatchEvent(new CustomEvent('lenis-scroll-to', {
                detail: {
                    target: element,
                    offset: -140
                }
            }));
        }
    };

    return (
        <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
            <div className="container mx-auto px-4">
                <div className="flex items-center md:justify-center gap-2 md:gap-8 py-4 min-w-max">
                    {categories.map((cat) => {
                        const isActive = activeSection === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => scrollToSection(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 whitespace-nowrap group relative ${isActive
                                    ? `${cat.color} ${cat.bg} shadow-sm scale-105`
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    } hover:-translate-y-1 hover:shadow-md`}
                            >
                                <cat.icon size={18} className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span>{cat.name}</span>
                                {isActive && (
                                    <Motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 border-2 border-current opacity-20 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

QuickNav.propTypes = {
    activeSection: PropTypes.string
};

const Home = () => {
    const { selectedCity } = useLocation();
    const [movies, setMovies] = useState([]);
    const [events, setEvents] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [stores, setStores] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('movies');

    useEffect(() => {
        const observerOptions = {
            root: null,
            // Adjust margin to detect sections when they are near the top (under the nav)
            // Top: -15% (ignores top 15% of viewport)
            // Bottom: -60% (ignores bottom 60% of viewport)
            // Active zone is between 15% and 40% from the top
            rootMargin: '-15% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            // Find the entry that is currently intersecting
            const intersectingEntry = entries.find(entry => entry.isIntersecting);
            if (intersectingEntry) {
                setActiveSection(intersectingEntry.target.id);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['movies', 'events', 'dining', 'activities', 'shopping'];

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [loading, movies, events, restaurants, stores, activities]);

    useEffect(() => {
        if (selectedCity) {
            Promise.resolve().then(() => setLoading(true));
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

    if (!selectedCity) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <p className="text-xl text-gray-500 animate-pulse">Waiting for location...</p>
        </div>
    );

    if (loading) return <Loader />;

    return (
        <div className="bg-gray-50 min-h-screen">
            <HeroSection city={selectedCity} />
            <QuickNav activeSection={activeSection} />

            <div className="space-y-0 overflow-x-hidden">
                <HomeSection
                    id="movies"
                    title="Recommended Movies"
                    icon={Film}
                    data={movies}
                    viewAllPath="/movies"
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

                <HomeSection
                    id="events"
                    title="Trending Events"
                    icon={Calendar}
                    data={events}
                    viewAllPath="/events"
                    renderCard={(event) => (
                        <PremiumCard
                            item={event}
                            link={`/events/${event._id}`}
                            image={event.image}
                            subtitle={event.type}
                            badge={event.price ? `₹${event.price}` : 'Free'}
                            badgeColor="bg-brand-600"
                        />
                    )}
                />

                <HomeSection
                    id="dining"
                    title="Premium Dining"
                    icon={UtensilsCrossed}
                    data={restaurants}
                    viewAllPath="/restaurants"
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

                <HomeSection
                    id="activities"
                    title="Exciting Adventures"
                    icon={Zap}
                    data={activities}
                    viewAllPath="/activities"
                    renderCard={(activity) => (
                        <PremiumCard
                            item={activity}
                            link={`/activities/${activity._id}`}
                            image={activity.image}
                            subtitle={activity.type}
                            badge={`₹${activity.price}`}
                            badgeColor="bg-brand-600"
                        />
                    )}
                />

                <HomeSection
                    id="shopping"
                    title="Premium Shopping"
                    icon={ShoppingBag}
                    data={stores}
                    viewAllPath="/stores"
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
        </div>
    );
};

export default Home;

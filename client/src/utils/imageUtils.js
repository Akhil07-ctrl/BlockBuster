// Image fallback URLs for different entity types
export const FALLBACK_IMAGES = {
    movie: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
    event: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    store: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    activity: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop',
    generic: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070&auto=format&fit=crop'
};

/**
 * Returns the appropriate fallback image URL for a given entity type
 * @param {string} type - The entity type (movie, event, restaurant, store, activity)
 * @returns {string} URL of the fallback image
 */
export const getFallbackImage = (type) => {
    const normalizedType = type?.toLowerCase();
    return FALLBACK_IMAGES[normalizedType] || FALLBACK_IMAGES.generic;
};

/**
 * Handle image error by setting fallback image
 * @param {Event} e - The error event
 * @param {string} type - The entity type
 */
export const handleImageError = (e, type) => {
    e.target.src = getFallbackImage(type);
    e.target.onerror = null; // Prevent infinite loop if fallback fails
};

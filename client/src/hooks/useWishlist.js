import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getWishlist, toggleWishlist as toggleWishlistApi } from '../api';
import toast from 'react-hot-toast';

export const useWishlist = (itemId, itemType) => {
    const { user, isLoaded } = useUser();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkWishlist = async () => {
            if (!isLoaded || !user || !itemId) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await getWishlist(user.id);
                const found = data.some(item =>
                    item.itemId === itemId && item.itemType === itemType
                );
                setIsWishlisted(found);
            } catch (err) {
                console.error('Error checking wishlist:', err);
            } finally {
                setLoading(false);
            }
        };

        checkWishlist();
    }, [user, isLoaded, itemId, itemType]);

    const toggle = async () => {
        if (!user) {
            toast.error('Please sign in to add to Hotlist');
            return;
        }

        try {
            const { data } = await toggleWishlistApi({
                clerkId: user.id,
                itemId,
                itemType
            });

            const found = data.wishlist.some(item =>
                item.itemId === itemId && item.itemType === itemType
            );
            setIsWishlisted(found);
            toast.success(data.message);
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            toast.error('Failed to update Hotlist');
        }
    };

    return { isWishlisted, loading, toggle };
};

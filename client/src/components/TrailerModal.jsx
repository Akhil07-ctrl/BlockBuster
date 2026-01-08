import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
    if (!trailerUrl) return null;

    // Convert YouTube URL to embed URL if needed
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    const embedUrl = getEmbedUrl(trailerUrl);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10"
                        >
                            <X size={24} />
                        </button>

                        {/* Title (Optional) */}
                        {title && (
                            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/50 rounded-lg text-white font-bold backdrop-blur-md border border-white/10">
                                {title}
                            </div>
                        )}

                        {/* Video Player */}
                        <iframe
                            src={`${embedUrl}?autoplay=1`}
                            title={title || "Movie Trailer"}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TrailerModal;

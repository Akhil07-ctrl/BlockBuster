import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
    const { pathname } = useLocation();
    const lenisRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        let rafId = null;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    useEffect(() => {
        const handleScrollTo = (e) => {
            const { target, offset = 0 } = e.detail;
            if (lenisRef.current) {
                lenisRef.current.scrollTo(target, { offset, duration: 1.5 });
            }
        };

        window.addEventListener('lenis-scroll-to', handleScrollTo);
        return () => window.removeEventListener('lenis-scroll-to', handleScrollTo);
    }, []);

    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return <div className="w-full min-h-screen">{children}</div>;
}

import { motion as Motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function FadeIn({ children, className, delay = 0, direction = 'up', fullWidth = false }) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 },
        none: { y: 0, x: 0 },
    };

    return (
        <Motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.7,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={Cn(fullWidth ? "w-full" : "", className)}
        >
            {children}
        </Motion.div>
    );
}

export function StaggerContainer({ children, className, staggerDelay = 0.1 }) {
    return (
        <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </Motion.div>
    );
}

export function StaggerItem({ children, className }) {
    return (
        <Motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: "easeOut"
                    }
                }
            }}
            className={className}
        >
            {children}
        </Motion.div>
    );
}

export function ScaleHover({ children, className, scale = 1.05 }) {
    return (
        <Motion.div
            whileHover={{ scale: scale }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </Motion.div>
    );
}

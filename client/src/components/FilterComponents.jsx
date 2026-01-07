import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4">
            <Motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left"
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <Motion.span 
                    className="font-semibold text-gray-900"
                    animate={{ color: isOpen ? '#f97316' : '#111827' }}
                    transition={{ duration: 0.2 }}
                >
                    {title}
                </Motion.span>
                <Motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                    className="text-brand-600"
                >
                    <ChevronDown size={18} />
                </Motion.div>
            </Motion.button>
            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        className="mt-3 space-y-2 overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Checkbox = ({ label, checked, onChange }) => (
    <Motion.label 
        className="flex items-center cursor-pointer p-2 rounded transition-all group"
        whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.05)' }}
        transition={{ duration: 0.2 }}
    >
        <Motion.input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mr-3 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer accent-brand-600"
            style={{ accentColor: '#f97316' }}
            whileHover={{ scale: 1.1 }}
        />
        <Motion.span 
            className="text-sm text-gray-700 font-medium transition-colors"
            animate={{ color: checked ? '#f97316' : '#374151' }}
            transition={{ duration: 0.2 }}
        >
            {label}
        </Motion.span>
    </Motion.label>
);

export { FilterSection, Checkbox };

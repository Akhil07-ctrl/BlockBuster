import { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
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

const FilterDrawer = ({ isOpen, onClose, onClear, hasAppliedFilters, children }) => {
    return (
        <AnimatePresence>
            {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                <Motion.div
                    className={`fixed lg:relative inset-0 lg:inset-auto z-[60] lg:z-0 lg:w-64 shrink-0 ${(isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 'flex' : 'hidden lg:block'}`}
                    initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Mobile Backdrop */}
                    <div
                        className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <Motion.div
                        className="relative bg-white w-[280px] lg:w-full h-full lg:h-auto rounded-r-3xl lg:rounded-2xl border-r lg:border border-gray-200 overflow-hidden shadow-2xl lg:shadow-lg sticky top-0 lg:top-24 flex flex-col"
                        initial={typeof window !== 'undefined' && window.innerWidth < 1024 ? { x: -280 } : false}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-brand-50/50 to-purple-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Filter size={20} className="text-brand-600" />
                                <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <AnimatePresence>
                                    {hasAppliedFilters && (
                                        <Motion.button
                                            onClick={onClear}
                                            className="text-brand-600 text-sm font-bold hover:text-brand-700 transition-colors"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Clear
                                        </Motion.button>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={onClose}
                                    className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 overflow-y-auto">
                            {children}
                        </div>
                    </Motion.div>
                </Motion.div>
            )}
        </AnimatePresence>
    );
};

export { FilterSection, Checkbox, FilterDrawer };

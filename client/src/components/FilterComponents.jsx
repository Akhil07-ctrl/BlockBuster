import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left mb-2"
            >
                <span className="font-semibold text-gray-900">{title}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isOpen && <div className="mt-3 space-y-2">{children}</div>}
        </div>
    );
};

const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mr-2 w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

export { FilterSection, Checkbox };

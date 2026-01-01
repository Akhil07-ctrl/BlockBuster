import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(() => {
        try {
            const saved = localStorage.getItem('blockbuster_city');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const updateCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem('blockbuster_city', JSON.stringify(city));
    };

    return (
        <LocationContext.Provider value={{ selectedCity, updateCity }}>
            {children}
        </LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLocation = () => useContext(LocationContext);

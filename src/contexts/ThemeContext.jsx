import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Memoize provider values to avoid downstream rerendering
    const value = useMemo(() => ({
        theme,
        toggleTheme,
    }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

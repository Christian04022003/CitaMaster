// src/context/ThemeContext.js

import React, { createContext, useContext } from 'react';
import { colors } from './theme';

// 1. Crea el contexto
const ThemeContext = createContext();

// 2. Crea el proveedor que envuelve tu app
export const ThemeProvider = ({ children }) => {
    return (
        <ThemeContext.Provider value={{ colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 3. Crea un hook personalizado para usar el contexto
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};
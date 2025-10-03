import { useContext, createContext, useState, useCallback } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const lightTheme = {
    background: '#F2F2F7',
    primary: '#FFFFFF',
    secondary: '#FFAD01',
    textColor: '#1b1c1e',
    borderColor: '#ddd',
  };

  const darkTheme = {
    background: 'black',
    primary: '#1b1c1e',
    secondary: '#FFAD01',
    textColor: '#FFFFFF',
    borderColor: '#444',
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, [setIsDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
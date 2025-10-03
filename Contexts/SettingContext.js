import { useAuthContext } from './AuthContext';
import { useThemeContext } from './ThemeContext';
import { useContext, createContext, useState, useEffect, useCallback } from 'react';

export const SettingContext = createContext();

const SettingProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [showLogoutBtn, setShowLogoutBtn] = useState(true);
  const [showStatusbar, setShowStatusbar] = useState(false);

  const toggleShowLogoutBtn = () => setShowLogoutBtn(!showLogoutBtn);
  const toggleShowStatusbar = () => setShowStatusbar(!showStatusbar);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userToken) return;

      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/settings.json`);
        if (!response.ok) throw new Error('Failed to fetch user settings.');

        const settings = await response.json();
        if (settings) {
          setShowLogoutBtn(settings.showLogout ?? true);
          setShowStatusbar(settings.showStatusbar ?? false);
          if (settings.darkMode !== isDarkMode) toggleTheme();
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
  }, [userToken, isDarkMode, toggleTheme]);

  const saveSettingStatesOfUser = useCallback(async (key, value) => {
    try {
      await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}/settings.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      saveSettingStatesOfUser("darkMode", isDarkMode);
    }
  }, [userToken, isDarkMode, saveSettingStatesOfUser]);

  useEffect(() => {
    if (userToken) {
      saveSettingStatesOfUser("showLogout", showLogoutBtn);
    }
  }, [userToken, showLogoutBtn, saveSettingStatesOfUser]);

  useEffect(() => {
    if (userToken) {
      saveSettingStatesOfUser("showStatusbar", showStatusbar);
    }
  }, [userToken, showStatusbar, saveSettingStatesOfUser]);


  return (
    <SettingContext.Provider
      value={{ showLogoutBtn, showStatusbar, toggleShowLogoutBtn, toggleShowStatusbar }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSettingContext = () => {
  return useContext(SettingContext);
};

export default SettingProvider;
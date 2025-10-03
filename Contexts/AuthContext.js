import { Alert } from 'react-native';
import { useContext, createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);

  const login = (uid) => setUserToken(uid);


  useEffect(() => {
    if (!userToken) return;

    const getUserProfileDetail = async () => {
      try {
        const response = await fetch(`https://book-e-commerce-bd561-default-rtdb.firebaseio.com/users/${userToken}.json`);
        const data = await response.json();
        const state = {
          username: data.username,
          phone: data.phone,
          email: data.email,
          gender: data.gender,
        };
        return state;
      } catch (error) {
        return [];
      }
    };

    getUserProfileDetail().then((userDetail) => {
      setUser(userDetail);
    });
  }, [userToken]);

  const logoutUser = () => {
    setUser(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logoutUser, userToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
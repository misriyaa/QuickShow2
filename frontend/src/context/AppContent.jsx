import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { meta } from "eslint-plugin-react-hooks";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ← ADDED

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      }
    } catch (error) {
      console.error("User data fetch failed");
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/isAuth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }
    } catch (error) {
      setIsLoggedin(false);
    } finally {
      setIsLoading(false); // ← ADDED — always runs after check
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData,
    isLoading, // ← ADDED
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
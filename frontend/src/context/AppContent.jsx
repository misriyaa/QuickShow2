import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Attach token to every request automatically
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

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
      const token = localStorage.getItem("token");
      if (!token) return; // no token = not logged in, skip the request

      const { data } = await axios.post(backendUrl + "/api/auth/isAuth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        localStorage.removeItem("token"); // token invalid, clear it
      }
    } catch (error) {
      setIsLoggedin(false);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  // Call this after a successful login/register API response
  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedin(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedin(false);
    setUserData(null);
  };

  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData,
    isLoading,
    saveToken,  // ← use this after login/register
    logout,     // ← use this instead of calling the logout API
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
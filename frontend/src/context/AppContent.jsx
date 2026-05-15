import { createContext, useState, useEffect } from "react";
import axiosInstance from "../library/axios"; // ✅ use this, interceptor already inside

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ❌ remove the axios.interceptors block — already handled in axios.js

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data"); // ✅ no need to add backendUrl, baseURL is set
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
      if (!token) return;
      const { data } = await axiosInstance.post("/api/auth/isAuth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        localStorage.removeItem("token");
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
    saveToken,
    logout,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
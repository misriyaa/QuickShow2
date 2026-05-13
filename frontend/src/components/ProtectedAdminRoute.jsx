import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";

const ProtectedAdminRoute = ({ children }) => {
  const { isLoggedin, userData } = useContext(AppContent);

  // not logged in
  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  // not admin
  if (!userData?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
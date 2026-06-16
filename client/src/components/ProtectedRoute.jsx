// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />; // ✅ verify hone tak rukko
  if (!user) return <Navigate to="/login" replace />; // ✅ tab redirect karo

  return children;
};

export default ProtectedRoute;
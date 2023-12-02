import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RedirectIfAuthenticated = () => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
export default RedirectIfAuthenticated;

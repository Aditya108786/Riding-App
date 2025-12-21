import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user/auth", { withCredentials: true });
        if (isMounted && res.status === 200) setAuthenticated(true);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (isMounted) setAuthenticated(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => { isMounted = false; };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/Userlogin" replace />;

  return children;
};

export default UserProtectedRoute;

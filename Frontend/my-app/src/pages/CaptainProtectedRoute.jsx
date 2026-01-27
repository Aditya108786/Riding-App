import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedRoute = ({ children }) => {
  const [authenticated, setauthenticated] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/auth`, { withCredentials: true });
        
        if (isMounted && res.status === 200) {
          setauthenticated(true);
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
        if (isMounted) setauthenticated(false);
      } finally {
        if (isMounted) setloading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/Captainlogin" replace />;

  return children;
};

export default CaptainProtectedRoute;

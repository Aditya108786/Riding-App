import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AuthGuard = ({ children, endpoint, redirectTo }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get(endpoint, { withCredentials: true });
        if (isMounted && res.status === 200) {
          setAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <i className="ri-loader-4-line animate-spin"></i>
          Checking session...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthGuard;

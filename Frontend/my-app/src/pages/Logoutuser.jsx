import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buildServiceUrl } from "../lib/serviceUrl";

export const Logoutuser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userlogout = async () => {
      try {
        await axios.post(buildServiceUrl('/user/logout'), {}, { withCredentials: true });
      } catch (err) {
        // Ignore and still clear local session UI by redirecting.
      } finally {
        navigate("/Userlogin", { replace: true });
      }
    };

    userlogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-medium">
      Logging out...
    </div>
  );
};


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Captainlogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get("http://localhost:4000/captain/logout", { withCredentials: true });
        if (response.status === 200) {
            console.log(response.status)
          navigate("/Captainlogin");
        }
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

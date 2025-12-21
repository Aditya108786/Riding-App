import { useState, useContext } from "react";
import { UserdataContext } from "../context/usercontext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Userlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { user, setuserdata,updateuser, error, seterror, isloading, setloading } =
    useContext(UserdataContext);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror(null);

    try {
      // ✅ Axios call: body and config separated
      const response = await axios.post(
        "http://localhost:4000/user/login",
        { email, password },      // request body
        { withCredentials: true }  // config: send HTTP-only cookie
      );

      // Backend sends only user info; cookie is stored automatically
      if (response.status === 200) {
        console.log(response.data.user.user)
        updateuser({...response.data.user}); // store user info in context
        navigate("/Userhome");                  // go to protected/home route
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      seterror(err.response?.data?.message || "Login failed");
    } finally {
      setloading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="p-7">
      <h2 className="text-2xl font-bold mb-7">Login to your account</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handlesubmit}>
        <h3 className="text-xl mb-2">What's your email</h3>
        <input
          required
          className="mb-7 rounded px-4 py-2 border w-full text-lg placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
        <input
          required
          className="mb-7 rounded px-4 py-2 border w-full text-lg placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {isloading ? "Logging in ..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Userlogin;

import { useState, useContext } from "react";
import { UserdataContext } from "../context/usercontext.jsx";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
// Import the new modal component
import ChangePasswordModal from "../Components/ChangePasswordModal.jsx"; 

const Userlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false); // Modal State
  
  const navigate = useNavigate();
  const { updateuser, error, seterror, isloading, setloading } = useContext(UserdataContext);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror(null);
    try {
      const response = await axios.post(
        "http://localhost:4000/user/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        updateuser({ ...response.data.user });
        navigate("/Userhome");
      }
    } catch (err) {
      seterror(err.response?.data?.message || "Invalid email or password");
    } finally {
      setloading(false);
      setPassword(""); 
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      {/* 1. THE POPUP MODAL */}
      {isForgotModalOpen && (
        <ChangePasswordModal onClose={() => setIsForgotModalOpen(false)} type="user"/>
      )}

      {/* Top Header */}
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 px-8 pt-4 pb-12 flex flex-col justify-between">
        <div>
          <header className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Enter your credentials to continue</p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handlesubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  required
                  className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-lg"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                {/* 2. TRIGGER MODAL HERE */}
                <button 
                  type="button" 
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-bold text-blue-600"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  required
                  className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-lg"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isloading}
              type="submit"
              className="bg-black text-white font-bold py-4 rounded-2xl w-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-400 mt-4"
            >
              {isloading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 font-medium">
            New here? <Link to="/UserSignup" className="text-blue-600 font-bold">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Userlogin;
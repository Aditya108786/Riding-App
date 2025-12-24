import { useState, useContext } from "react";
import { CaptaindataContext } from "../context/captaincontext.jsx";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2, LayoutGrid } from "lucide-react";
import ChangePasswordModal from "../Components/ChangePasswordModal.jsx";

const Captainlogin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
 const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  const { updatecaptain, isloading, setloading, error, seterror } = useContext(CaptaindataContext);
  const navigate = useNavigate();

  const submithandler = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/captain/login",
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;
      if (response.status === 200) {
        updatecaptain({ ...data.captain });
        setloading(false);
        navigate("/CaptainHome");
      }
    } catch (err) {
      seterror(err.response?.data?.message || "Invalid credentials. Please try again.");
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white">

        {isForgotModalOpen && (
            <ChangePasswordModal onClose={()=>setIsForgotModalOpen(false)}  type="captain"/>
        )}
      {/* Top Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Captain Mode
            </span>
        </div>
      </div>

      <div className="flex-1 px-8 pt-4 pb-12 flex flex-col justify-between">
        <div>
          <header className="mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/20">
                <LayoutGrid size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">Captain Login</h2>
            <p className="text-slate-400 mt-2 font-medium">Ready to hit the road and earn?</p>
          </header>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={submithandler} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-tighter">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  required
                  className="bg-white/5 w-full rounded-2xl pl-12 pr-4 py-4 border border-white/10 focus:border-emerald-500 focus:bg-white/10 transition-all outline-none font-medium text-lg text-white"
                  type="email"
                  placeholder="captain@rideflow.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Password</label>
                <button onClick={()=>{
                    setIsForgotModalOpen(true)
                }} type="button" className="text-xs font-bold text-emerald-500">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  required
                  className="bg-white/5 w-full rounded-2xl pl-12 pr-4 py-4 border border-white/10 focus:border-emerald-500 focus:bg-white/10 transition-all outline-none font-medium text-lg text-white"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isloading}
              type="submit"
              className="bg-emerald-600 text-white font-bold py-4 rounded-2xl w-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-emerald-900/20 disabled:bg-slate-800 disabled:text-slate-500 mt-4"
            >
              {isloading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Accessing Dashboard...
                </>
              ) : (
                "Go Online"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 font-medium">
            Not a captain yet? <Link to="/Captainsignup" className="text-emerald-500 font-bold">Register here</Link>
          </p>
        </div>

        <div className="mt-auto">
            <p className="text-[11px] leading-tight text-slate-500 text-center max-w-[280px] mx-auto">
                By logging in, you agree to comply with Captain Safety Regulations and Privacy Standards.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Captainlogin;
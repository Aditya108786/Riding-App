import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsloading(true);
    setError(null);

    try {
      // Replace with your actual password reset endpoint
      const response = await axios.post("http://localhost:4000/user/reset-password", {
        password: newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setIsloading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Password Changed!</h2>
        <p className="text-slate-500 mt-2">Your security is our priority. Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 px-8 pt-4 pb-12 flex flex-col">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">New Password</h2>
          <p className="text-slate-500 mt-2 font-medium">Create a strong password to protect your account.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex-1">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                required
                type={showPassword ? "text" : "password"}
                className="bg-slate-100 w-full rounded-2xl pl-12 pr-12 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-lg"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                required
                type={showPassword ? "text" : "password"}
                className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-lg"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Password Requirements Hint */}
          <div className="bg-blue-50 p-4 rounded-2xl">
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              💡 Tip: Use at least 8 characters with a mix of letters, numbers, and symbols for a stronger account.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <button
              disabled={isloading}
              type="submit"
              className="bg-black text-white font-bold py-4 rounded-2xl w-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-400"
            >
              {isloading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
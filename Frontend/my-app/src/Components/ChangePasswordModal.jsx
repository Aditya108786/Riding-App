import React, { useState } from 'react';
import { Lock, X, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const ChangePasswordModal = ({type, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email , setemail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsloading(true);
    setError(null);

    try {
          const endpoint = type === "captain" ? "http://localhost:4000/captain/reset_password" : "http://localhost:4000/user/reset_password"


      const response = await axios.post(endpoint, {
        email,
        password: newPassword,
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(onClose, 2500); // Auto-close modal after success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Reset Password</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldCheck size={32} />
            </div>
            <p className="font-bold text-lg">Password Updated!</p>
            <p className="text-slate-500 text-sm">You can now log in with your new credentials.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                  placeholder="aditya@email.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
                <input
                  required
                  type="password"
                  className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-slate-900"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
                <input
                  required
                  type="password"
                  className="bg-slate-100 w-full rounded-2xl pl-12 pr-4 py-4 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium text-slate-900"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isloading}
              className="bg-black text-white font-bold py-4 rounded-2xl w-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              {isloading ? <Loader2 className="animate-spin" size={20} /> : "Save New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
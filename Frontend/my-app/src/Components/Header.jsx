import React from "react";
import { ArrowLeft, LogOut } from "lucide-react";

const Header = ({ title, subtitle, onBack, onLogout, rightNode }) => {
  return (
    <header className="p-4 sm:p-5 bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="min-w-0">
            {title && <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{title}</h1>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rightNode}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

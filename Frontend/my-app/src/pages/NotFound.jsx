import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-slate-400">404</p>
        <h1 className="text-3xl font-bold mt-2">Page not found</h1>
        <p className="text-slate-400 mt-3">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-flex mt-6 rounded-xl bg-white text-slate-900 px-4 py-2 font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

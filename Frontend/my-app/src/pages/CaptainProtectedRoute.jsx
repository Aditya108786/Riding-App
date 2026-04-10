import AuthGuard from "../Components/AuthGuard";
import { buildServiceUrl } from "../lib/serviceUrl";

const CaptainProtectedRoute = ({ children }) => {
  return (
    <AuthGuard
      endpoint={buildServiceUrl('/captain/auth')}
      redirectTo="/Captainlogin"
    >
      {children}
    </AuthGuard>
  );
};

export default CaptainProtectedRoute;

import AuthGuard from "../Components/AuthGuard";
import { buildServiceUrl } from "../lib/serviceUrl";

const UserProtectedRoute = ({ children }) => {
  return (
    <AuthGuard
      endpoint={buildServiceUrl('/user/auth')}
      redirectTo="/Userlogin"
    >
      {children}
    </AuthGuard>
  );
};

export default UserProtectedRoute;

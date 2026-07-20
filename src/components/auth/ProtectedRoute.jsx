import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ROUTES from '@/constants/routes.constants';

/**
 * Component checking authentication parameters.
 * Redirects guests back to login paths.
 */
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    
    return children ? children : <Outlet />;
};

export default ProtectedRoute;

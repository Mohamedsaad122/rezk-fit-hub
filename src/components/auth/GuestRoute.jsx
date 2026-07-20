import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ROUTES from '@/constants/routes.constants';

/**
 * Component locking login paths for active user sessions.
 * Redirects logged in users back to dashboard panels.
 */
export const GuestRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    
    return children ? children : <Outlet />;
};

export default GuestRoute;

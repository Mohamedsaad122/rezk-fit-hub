import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ROUTES from '@/constants/routes.constants';

/**
 * Component verifying role capabilities parameters.
 * Redirects unauthorized queries back to dashboard context.
 */
export const RoleGuard = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    
    if (!allowedRoles.includes(user?.role)) {
        // Fallback to home/dashboard if user does not possess permissions
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    
    return children ? children : <Outlet />;
};

export default RoleGuard;

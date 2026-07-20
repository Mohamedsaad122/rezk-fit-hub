import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import ROUTES from '@/constants/routes.constants';

export const RoleRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    
    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
    
    return children ? children : <Outlet />;
};

export default RoleRoute;

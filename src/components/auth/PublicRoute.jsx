import { Outlet } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
    return children ? children : <Outlet />;
};

export default PublicRoute;

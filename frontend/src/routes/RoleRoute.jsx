import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { ROUTES } from '../utils/constants';
import PrivateRoute from './PrivateRoute';

const RoleRoute = ({ children, allowedRoles }) => {
  return (
    <PrivateRoute>
      <RoleCheck allowedRoles={allowedRoles}>{children}</RoleCheck>
    </PrivateRoute>
  );
};

const RoleCheck = ({ children, allowedRoles }) => {
  const { role } = useRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default RoleRoute;

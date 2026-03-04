import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Route guard with role/permission support.
 *
 * Props:
 *  - adminOnly: only ROLE_STAFF / ROLE_SUPER_ADMIN may access
 *  - customerOnly: only ROLE_CUSTOMER may access
 *  - requiredPermission: specific permission key required (super admin always passes)
 */
const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false, requiredPermission }) => {
  const { user, isAdmin, hasPermission } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Admin-only routes — redirect customers away
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Customer-only routes — redirect admins away
  if (customerOnly && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  // Permission check (super admin always passes via hasPermission)
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

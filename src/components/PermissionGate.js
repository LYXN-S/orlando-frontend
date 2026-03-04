import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Conditionally renders children if the user has the required permission.
 * Super admins always pass the check.
 *
 * Usage: <PermissionGate permission="MANAGE_PRODUCTS">...</PermissionGate>
 */
const PermissionGate = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useContext(AuthContext);

  if (!permission || hasPermission(permission)) {
    return children;
  }

  return fallback;
};

export default PermissionGate;

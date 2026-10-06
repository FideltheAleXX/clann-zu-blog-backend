export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRole = req.user.role?.toLowerCase();
    const roles = allowedRoles.map((role) => role.toLowerCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden. You do not have permission to perform this action.',
      });
    }

    next();
  };
};

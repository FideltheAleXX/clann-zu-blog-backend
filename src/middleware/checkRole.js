export const checkRole = (isAdmin) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!isAdmin.includes(req.user.role)) {
      return res.status(403).json({ error: '(Forbidden. Only for Admin' });
    }

    next();
  };
};

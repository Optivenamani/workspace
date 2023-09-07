const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.Accessrole.split('#');
    
    // Check if the user has at least one of the allowed roles
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (hasPermission) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action.",
      });
    }
  };
};

module.exports = checkPermissions;

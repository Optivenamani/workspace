const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userAccessRole = req.user.Accessrole;

    if (allowedRoles.some((role) => userAccessRole.includes(role))) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action.",
      });
    }
  };
};

module.exports = checkPermissions;

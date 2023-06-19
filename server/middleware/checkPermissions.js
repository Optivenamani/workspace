const AccessRoles = require('./accessRoles');

const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userAccessRole = req.user.Accessrole;
    const separatedRoles = AccessRoles.separateAccessRoles(userAccessRole);

    if (allowedRoles.some((role) => separatedRoles.includes(role))) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action.",
      });
    }
  };
};

module.exports = checkPermissions;

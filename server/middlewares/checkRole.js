const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const checkRole = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const userRole = decodedToken.role;

    // Check if the user has the required role
    if (!requiredRole.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Pass the authenticated user ID and role to the next middleware
    req.userId = userId;
    req.userRole = userRole;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = checkRole;

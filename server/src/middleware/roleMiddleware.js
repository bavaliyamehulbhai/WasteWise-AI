/**
 * Middleware to authorize specific user roles.
 * Must be used AFTER the `protect` (authentication) middleware.
 * 
 * @param  {...string} allowedRoles - List of roles permitted to access the route
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Token is missing or invalid.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    // Additionally check if user is suspended
    if (req.user.status === "suspended" && !allowedRoles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Account is suspended. Please contact support.",
      });
    }

    next();
  };
};

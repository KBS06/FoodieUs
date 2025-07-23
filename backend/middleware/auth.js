// backend/middleware/auth.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ success: false, message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid Token";
    res.status(403).json({ success: false, message });
  }
};

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
    next();
  });
};

// Middleware to check if user is authenticated user (not admin)
const userMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User privileges required.",
      });
    }
    next();
  });
};

export { authMiddleware, adminMiddleware, userMiddleware };
export default authMiddleware;

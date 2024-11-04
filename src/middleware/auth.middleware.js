import jwt from "jsonwebtoken";
import User from "../../db/models/user.js";

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    try {
      const { BEARAR_KEY, JWT_SECRET } = process.env;
      const { authorization } = req.headers;

      // Validate authorization header
      if (!authorization || !authorization.startsWith(BEARAR_KEY)) {
        return res
          .status(400)
          .json({ msg: "Invalid or missing authorization header" });
      }

      // Extract and verify token
      const token = authorization.split(BEARAR_KEY)[1];
      if (!token) {
        return res.status(400).json({ msg: "Invalid token" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded) {
        return res.status(400).json({ msg: "Invalid authorization token" });
      }

      // Use userId to find the user
      const user = await User.findByPk(decoded.userId, {
        // Change to decoded.userId
        attributes: ["email", "role"], // Select only the needed fields
      });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (decoded.exp * 1000 < Date.now()) {
        return res
          .status(400)
          .json({ msg: "Expired token, please login again" });
      }

      // Check if user's role is allowed
      if (!accessRoles.includes(user.role)) {
        console.log("user role: ", user.role);
        return res
          .status(403)
          .json({ msg: "Not authorized to access this resource" });
      }
      req.user = user; // Attach user data to the request
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res
        .status(500)
        .json({ msg: "Internal server error during authentication" });
    }
  };
};

import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Admin from "../../../db/models/admins.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { name, email, password, phone_number } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new Error("Email already in use", { cause: 400 }));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUND);

  // Create the user record
  const user = await User.create({ email, password: hashedPassword });

  // Create the admin record linked to the user
  const admin = await Admin.create({
    name,
    phone_number,
    user_id: user.user_id,
  });

  res.status(201).json({
    message: "Admin registered successfully",
    admin: {
      admin_id: admin.admin_id,
      name: admin.name,
      email: user.email,
      phone_number: admin.phone_number,
    },
  });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new Error("Invalid password", { cause: 401 }));
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.user_id, email: user.email },
    process.env.JWT_SECRET, // Add `JWT_SECRET` to your .env file
    { expiresIn: "1h" } // Token validity (optional)
  );

  res.status(200).json({ message: "Signin successful", token });
};

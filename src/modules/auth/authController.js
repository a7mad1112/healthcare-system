import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Admin from "../../../db/models/admins.js";

export const signup = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
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

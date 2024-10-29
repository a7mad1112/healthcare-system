import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Clinic from "./../../../db/models/clinics.js";

export const createClinic = async (req, res, next) => {
  const { name, phone_number, location, userData } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({
    where: { email: userData.email },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use." });
  }

  // Hash the user's password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(
      userData.password,
      +process.env.SALT_ROUND
    );
  } catch (hashError) {
    console.error("Error hashing password:", hashError);
    return res.status(500).json({ message: "Error hashing password." });
  }

  // Create a new user for the clinic
  const newUser = await User.create({
    email: userData.email,
    password: hashedPassword,
  });

  // Create a new clinic
  const newClinic = await Clinic.create({
    name,
    phone_number,
    location,
    user_id: newUser.user_id,
  });

  return res.status(201).json({
    message: "Clinic created successfully.",
    clinic: newClinic,
  });
};

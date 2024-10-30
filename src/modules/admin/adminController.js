import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Clinic from "./../../../db/models/clinics.js";
import { sequelize } from "../../../db/connection.js";

export const createClinic = async (req, res, next) => {
  const { name, phone_number, location, userData } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({
    where: { email: userData.email },
  });
  if (existingUser) {
    return next(new Error("Email already in use.", { cause: 400 }));
  }

  // Hash the user's password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(
      userData.password,
      +process.env.SALT_ROUND
    );
  } catch (hashError) {
    return next(new Error("Error hashing password.", { cause: 500 }));
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

export const deleteClinic = async (req, res, next) => {
  const { clinic_id } = req.params;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Find the clinic by ID
  const clinic = await Clinic.findByPk(clinic_id, { transaction });
  if (!clinic) {
    await transaction.rollback();
    return next(new Error("Clinic not found.", { cause: 404 }));
  }

  // Find the associated user by user_id
  const user = await User.findByPk(clinic.user_id, { transaction });
  if (!user) {
    await transaction.rollback();
    return next(
      new Error("User associated with clinic not found.", { cause: 404 })
    );
  }

  // Delete the clinic and the associated user
  await clinic.destroy({ transaction });
  await user.destroy({ transaction });

  // Commit transaction if everything succeeds
  await transaction.commit();

  return res
    .status(200)
    .json({ message: "Clinic and associated user deleted successfully." });
};

export const editClinic = async (req, res, next) => {
  const { clinic_id } = req.params;
  const { name, phone_number, location } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Find the clinic by ID
  const clinic = await Clinic.findByPk(clinic_id, { transaction });
  if (!clinic) {
    await transaction.rollback();
    return next(new Error("Clinic not found.", { cause: 404 }));
  }

  // Update clinic details
  clinic.name = name || clinic.name;
  clinic.phone_number = phone_number || clinic.phone_number;
  clinic.location = location || clinic.location;

  // Save changes
  await clinic.save({ transaction });

  // Commit transaction if successful
  await transaction.commit();

  return res
    .status(200)
    .json({ message: "Clinic updated successfully.", clinic });
};

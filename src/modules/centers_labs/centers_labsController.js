import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import { sequelize } from "../../../db/connection.js";
import CenterLab from "../../../db/models/center_labs.js";

//* center/lab controllers:
export const createCenterLab = async (req, res, next) => {
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
  // Create a new user for the center lab
  const newUser = await User.create({
    password: hashedPassword,
    email: userData.email,
    role: "Center_Lab",
  });
  // Create a new center lab
  const newCenterLab = await CenterLab.create({
    name,
    phone_number,
    location,
    user_id: newUser.user_id,
  });
  return res.status(201).json({
    message: "Center lab created successfully.",
    centerLab: newCenterLab,
  });
};

// Delete a center lab
export const deleteCenterLab = async (req, res, next) => {
  const { center_lab_id } = req.params;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Find the center lab by ID
  const centerLab = await CenterLab.findByPk(center_lab_id, { transaction });
  if (!centerLab) {
    await transaction.rollback();
    return next(new Error("Center lab not found.", { cause: 404 }));
  }

  // Find the associated user by user_id
  const user = await User.findByPk(centerLab.user_id, { transaction });
  if (!user) {
    await transaction.rollback();
    return next(
      new Error("User associated with center lab not found.", { cause: 404 })
    );
  }

  // Delete the center lab and the associated user
  await centerLab.destroy({ transaction });
  await user.destroy({ transaction });

  // Commit transaction if everything succeeds
  await transaction.commit();

  return res
    .status(200)
    .json({ message: "Center lab and associated user deleted successfully." });
};

// Edit a center lab
export const editCenterLab = async (req, res, next) => {
  const { center_lab_id } = req.params;
  const { name, phone_number, location } = req.body;

  // Start a transaction
  const transaction = await sequelize.transaction();

  // Find the center lab by ID
  const centerLab = await CenterLab.findByPk(center_lab_id, { transaction });
  if (!centerLab) {
    await transaction.rollback();
    return next(new Error("Center lab not found.", { cause: 404 }));
  }

  // Update center lab details
  centerLab.name = name || centerLab.name;
  centerLab.phone_number = phone_number || centerLab.phone_number;
  centerLab.location = location || centerLab.location;

  // Save changes
  await centerLab.save({ transaction });

  // Commit transaction if successful
  await transaction.commit();

  return res
    .status(200)
    .json({ message: "Center lab updated successfully.", centerLab });
};

// Get all center labs
export const getAllCenterLabs = async (req, res, next) => {
  // Retrieve all center labs from the database
  const centerLabs = await CenterLab.findAll();
  // Check if center labs exist
  if (centerLabs.length === 0) {
    return next(new Error("No center labs found.", { cause: 404 }));
  }

  return res.status(200).json(centerLabs);
};

// Get a center lab by ID
export const getCenterLabById = async (req, res, next) => {
  const { center_lab_id } = req.params;

  // Find the center lab by ID
  const centerLab = await CenterLab.findByPk(center_lab_id);

  // Check if the center lab exists
  if (!centerLab) {
    return next(new Error("Center lab not found.", { cause: 404 }));
  }

  return res.status(200).json(centerLab);
};

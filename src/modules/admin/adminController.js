import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Clinic from "./../../../db/models/clinics.js";
import { sequelize } from "../../../db/connection.js";
import CenterLab from "../../../db/models/center_labs.js";
//* clinic controllers:

const createClinic = async (req, res, next) => {
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

const deleteClinic = async (req, res, next) => {
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

const editClinic = async (req, res, next) => {
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

const getAllClinics = async (req, res, next) => {
  // Retrieve all clinics from the database
  const clinics = await Clinic.findAll();
  // Check if clinics exist
  if (clinics.length === 0) {
    return next(new Error("No clinincs found.", { cause: 404 }));
  }
  return res.status(200).json(clinics);
};

const getCounts = async (req, res, next) => {
  // Count clinics
  const clinicsCount = await Clinic.count();

  // Count center/labs
  const centersLabsCount = await CenterLab.count();

  return res.status(200).json({
    clinics_count: clinicsCount,
    centers_labs_count: centersLabsCount,
  });
};

const getClinicById = async (req, res, next) => {
  const { clinic_id } = req.params;
  // Find the clinic by ID
  const clinic = await Clinic.findByPk(clinic_id);
  // Check if the clinic exists
  if (!clinic) {
    return next(new Error("Clinic not found.", { cause: 404 }));
  }
  return res.status(200).json(clinic);
};

export const clinicsContoller = {
  createClinic,
  deleteClinic,
  editClinic,
  getAllClinics,
  getCounts,
  getClinicById,
};

//* center/lab controllers:
const createCenterLab = async (req, res, next) => {
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
const deleteCenterLab = async (req, res, next) => {
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
const editCenterLab = async (req, res, next) => {
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
const getAllCenterLabs = async (req, res, next) => {
  // Retrieve all center labs from the database
  const centerLabs = await CenterLab.findAll();

  // Check if center labs exist
  if (centerLabs.length === 0) {
    return next(new Error("No center labs found.", { cause: 404 }));
  }

  return res.status(200).json(centerLabs);
};

// Get a center lab by ID
const getCenterLabById = async (req, res, next) => {
  const { center_lab_id } = req.params;

  // Find the center lab by ID
  const centerLab = await CenterLab.findByPk(center_lab_id);

  // Check if the center lab exists
  if (!centerLab) {
    return next(new Error("Center lab not found.", { cause: 404 }));
  }

  return res.status(200).json(centerLab);
};

export const centerLabsController = {
  createCenterLab,
  deleteCenterLab,
  editCenterLab,
  getAllCenterLabs,
  getCenterLabById,
};

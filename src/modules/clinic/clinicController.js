import bcrypt from "bcrypt";
import User from "../../../db/models/user.js";
import Clinic from "./../../../db/models/clinics.js";
import { sequelize } from "../../../db/connection.js";
import CenterLab from "../../../db/models/center_labs.js";

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
    role: "Clinic",
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

export const getAllClinics = async (req, res, next) => {
  // Retrieve all clinics from the database
  const clinics = await Clinic.findAll();
  // Check if clinics exist
  if (clinics.length === 0) {
    return next(new Error("No clinincs found.", { cause: 404 }));
  }
  return res.status(200).json(clinics);
};

export const getCounts = async (req, res, next) => {
  // Count clinics
  const clinicsCount = await Clinic.count();

  // Count center/labs
  const centersLabsCount = await CenterLab.count();

  return res.status(200).json({
    clinics_count: clinicsCount,
    centers_labs_count: centersLabsCount,
  });
};

export const getClinicById = async (req, res, next) => {
  const { clinic_id } = req.params;
  // Find the clinic by ID
  const clinic = await Clinic.findByPk(clinic_id);
  // Check if the clinic exists
  if (!clinic) {
    return next(new Error("Clinic not found.", { cause: 404 }));
  }
  return res.status(200).json(clinic);
};

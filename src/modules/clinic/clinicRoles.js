import { roles } from "../../roles.js";
export const endPoints = {
  createClinic: [roles.Admin],
  deleteClinic: [roles.Admin],
  editClinic: [roles.Admin],
  getAllClinics: [roles.Admin],
  count: [roles.Admin],
  getClinicById: [roles.Admin],
};


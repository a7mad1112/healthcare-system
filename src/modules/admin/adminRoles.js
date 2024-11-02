import { roles } from "../../roles.js";
export const endPoints = {
  createClinic: [roles.Admin],
  deleteClinic: [roles.Admin],
  editClinic: [roles.Admin],
  getAllClinics: [roles.Admin],
  count: [roles.Admin],
  getClinicById: [roles.Admin],
  createCenter_lab: [roles.Admin],
  deleteCenter_lab: [roles.Admin],
  editCenter_lab: [roles.Admin],
  getAllCenter_lab: [roles.Admin],
  getCenter_labById: [roles.Admin],
};

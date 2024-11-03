import { roles } from "../../roles.js";
export const endPoints = {
  createCenter_lab: [roles.Admin],
  deleteCenter_lab: [roles.Admin],
  editCenter_lab: [roles.Admin],
  getAllCenter_lab: [roles.Admin],
  getCenter_labById: [roles.Admin],
};

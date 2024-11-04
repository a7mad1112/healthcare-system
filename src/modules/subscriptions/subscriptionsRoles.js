import { roles } from "../../roles.js";

export const endPoints = {
  createSubscription: [roles.Admin],
  editSubscription: [roles.Admin],
  deleteSubscription: [roles.Admin],
  getAllSubscriptions: [roles.Admin],
  getSubscriptionById: [roles.Admin],
  test: [roles.Center_Lab, roles.Clinic],
};

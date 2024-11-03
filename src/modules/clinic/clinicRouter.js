import { Router } from "express";
import { asyncHandler } from "../../../utils/errorHandler.js";
import * as clinicsContoller from "./clinicController.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./clinicRoles.js";
const router = Router();

//* Routes to clinics
router.post(
  "/",
  auth(endPoints.createClinic),
  asyncHandler(clinicsContoller.createClinic)
);
router.delete(
  "/:clinic_id",
  auth(endPoints.deleteClinic),
  asyncHandler(clinicsContoller.deleteClinic)
);
router.put(
  "/:clinic_id",
  auth(endPoints.editClinic),
  asyncHandler(clinicsContoller.editClinic)
);
router.get(
  "/",
  auth(endPoints.getAllClinics),
  asyncHandler(clinicsContoller.getAllClinics)
);
router.get(
  "/counts",
  auth(endPoints.count),
  asyncHandler(clinicsContoller.getCounts)
);
router.get(
  "/:clinic_id",
  auth(endPoints.getClinicById),
  asyncHandler(clinicsContoller.getClinicById)
);

export default router;

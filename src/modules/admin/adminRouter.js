import { Router } from "express";
import { asyncHandler } from "../../../utils/errorHandler.js";
import { clinicsContoller, centerLabsController } from "./adminController.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./adminRoles.js";
const router = Router();

//* Routes to clinics
router.post(
  "/clinics",
  auth(endPoints.createClinic),
  asyncHandler(clinicsContoller.createClinic)
);
router.delete(
  "/clinics/:clinic_id",
  auth(endPoints.deleteClinic),
  asyncHandler(clinicsContoller.deleteClinic)
);
router.put(
  "/clinics/:clinic_id",
  auth(endPoints.editClinic),
  asyncHandler(clinicsContoller.editClinic)
);
router.get(
  "/clinics",
  auth(endPoints.getAllClinics),
  asyncHandler(clinicsContoller.getAllClinics)
);
router.get(
  "/counts",
  auth(endPoints.count),
  asyncHandler(clinicsContoller.getCounts)
);
router.get(
  "/clinics/:clinic_id",
  auth(endPoints.getClinicById),
  asyncHandler(clinicsContoller.getClinicById)
);

//* Routes for center/labs
router.post(
  "/center-labs",
  auth(endPoints.createCenter_lab),
  asyncHandler(centerLabsController.createCenterLab)
);
router.delete(
  "/center-labs/:center_lab_id",
  auth(endPoints.deleteCenter_lab),
  asyncHandler(centerLabsController.deleteCenterLab)
);
router.put(
  "/center-labs/:center_lab_id",
  auth(endPoints.editCenter_lab),
  asyncHandler(centerLabsController.editCenterLab)
);
router.get(
  "/center-labs",
  auth(endPoints.getAllCenter_lab),
  asyncHandler(centerLabsController.getAllCenterLabs)
);
router.get(
  "/center-labs/:center_lab_id",
  auth(endPoints.getCenter_labById),
  asyncHandler(centerLabsController.getCenterLabById)
);
export default router;

import { Router } from "express";
import { asyncHandler } from "../../../utils/errorHandler.js";
import { clinicsContoller, centerLabsController } from "./adminController.js";

const router = Router();

//* Routes to clinics
router.post("/clinics", asyncHandler(clinicsContoller.createClinic));
router.delete(
  "/clinics/:clinic_id",
  asyncHandler(clinicsContoller.deleteClinic)
);
router.put("/clinics/:clinic_id", asyncHandler(clinicsContoller.editClinic));
router.get("/clinics", asyncHandler(clinicsContoller.getAllClinics));
router.get("/counts", asyncHandler(clinicsContoller.getCounts));
router.get("/clinics/:clinic_id", asyncHandler(clinicsContoller.getClinicById));

//* Routes for center/labs
router.post("/center-labs", asyncHandler(centerLabsController.createCenterLab));
// router.delete("/center-labs/:center_lab_id", asyncHandler(deleteCenterLab));
// router.put("/center-labs/:center_lab_id", asyncHandler(editCenterLab));
// router.get("/center-labs", asyncHandler(getAllCenterLabs));
// router.get("/center-labs/:center_lab_id", asyncHandler(getCenterLabById));
export default router;

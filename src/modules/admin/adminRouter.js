import { Router } from "express";
import { asyncHandler } from "../../../utils/errorHandler.js";
import {
  createClinic,
  deleteClinic,
  editClinic,
  getAllClinics,
  getClinicById,
  getCounts,
} from "./adminController.js";

const router = Router();

// Routes to clinics
router.post("/clinics", asyncHandler(createClinic));
router.delete("/clinics/:clinic_id", asyncHandler(deleteClinic));
router.put("/clinics/:clinic_id", asyncHandler(editClinic));
router.get("/clinics", asyncHandler(getAllClinics));
router.get("/counts", asyncHandler(getCounts));
router.get("/clinics/:clinic_id", asyncHandler(getClinicById));

export default router;

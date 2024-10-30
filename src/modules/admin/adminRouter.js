import { Router } from "express";
import {
  createClinic,
  deleteClinic,
  editClinic,
  getAllClinics,
} from "./adminController.js";

const router = Router();

// Routes to clinics
router.post("/clinics", createClinic);
router.delete("/clinics/:clinic_id", deleteClinic);
router.put("/clinics/:clinic_id", editClinic);
router.get("/clinics", getAllClinics);

export default router;

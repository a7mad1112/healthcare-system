import { Router } from "express";
import { createClinic, deleteClinic } from "./adminController.js";

const router = Router();

// Route to create a clinic
router.post("/clinics", createClinic);
router.delete("/clinics/:clinic_id", deleteClinic);

export default router;

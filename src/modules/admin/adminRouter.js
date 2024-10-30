import { Router } from "express";
import { createClinic, deleteClinic, editClinic } from "./adminController.js";

const router = Router();

// Route to create a clinic
router.post("/clinics", createClinic);
router.delete("/clinics/:clinic_id", deleteClinic);
router.put("/clinics/:clinic_id", editClinic);

export default router;

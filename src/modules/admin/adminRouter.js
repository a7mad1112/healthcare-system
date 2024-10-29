import { Router } from "express";
import { createClinic } from "./adminController.js";

const router = Router();

// Route to create a clinic
router.post("/clinics", createClinic);

export default router;

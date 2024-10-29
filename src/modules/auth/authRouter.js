import express from "express";
import { signup } from "./authController.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

const router = express.Router();

// Admin signup route
router.post("/signup", asyncHandler(signup));

export default router;

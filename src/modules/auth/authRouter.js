import express from "express";
import { signup, signin } from "./authController.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

const router = express.Router();

// Admin signup route
router.post("/signup", asyncHandler(signup));
router.post("/signin", asyncHandler(signin));

export default router;

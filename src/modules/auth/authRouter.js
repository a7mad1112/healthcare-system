import express from "express";
import * as authController from "./authController.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

const router = express.Router();

// Admin signup route
router.post("/signup", asyncHandler(authController.signup));
router.post("/signin", asyncHandler(authController.signin));

export default router;

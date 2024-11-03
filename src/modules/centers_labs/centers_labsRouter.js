import { Router } from "express";
import { asyncHandler } from "../../../utils/errorHandler.js";
import * as centerLabsController from "./centers_labsController.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./centers_labsRoles.js";
const router = Router();

router.post(
  "/",
  auth(endPoints.createCenter_lab),
  asyncHandler(centerLabsController.createCenterLab)
);
router.delete(
  "/:center_lab_id",
  auth(endPoints.deleteCenter_lab),
  asyncHandler(centerLabsController.deleteCenterLab)
);
router.put(
  "/:center_lab_id",
  auth(endPoints.editCenter_lab),
  asyncHandler(centerLabsController.editCenterLab)
);
router.get(
  "/",
  auth(endPoints.getAllCenter_lab),
  asyncHandler(centerLabsController.getAllCenterLabs)
);
router.get(
  "/:center_lab_id",
  auth(endPoints.getCenter_labById),
  asyncHandler(centerLabsController.getCenterLabById)
);
export default router;

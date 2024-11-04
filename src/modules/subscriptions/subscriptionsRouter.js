import express from "express";
import { endPoints } from "./subscriptionsRoles.js";
import * as subscriptionsController from "./subscriptionsController.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "./../../../utils/errorHandler.js";

const router = express.Router();

router.post(
  "/",
  auth(endPoints.createSubscription),
  asyncHandler(subscriptionsController.createSubscription)
);

router.put(
  "/:id",
  auth(endPoints.editSubscription),
  subscriptionsController.updateSubscription
);
router.delete(
  "/:id",
  auth(endPoints.deleteSubscription),
  subscriptionsController.deleteSubscription
);
router.get(
  "/",
  auth(endPoints.getAllSubscriptions),
  subscriptionsController.getAllSubscriptions
);
router.get(
  "/:id",
  auth(endPoints.getSubscriptionById),
  subscriptionsController.getSubscriptionById
);

export default router;

import express from "express";
import { endPoints } from "./subscriptionsRoles.js";
import * as subscriptionsController from "./subscriptionsController.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "./../../../utils/errorHandler.js";
import { checkSubscriptionStatus } from "../../middleware/subscription.middleware.js";

const router = express.Router();
router.get(
  "/test",
  auth(endPoints.test),
  checkSubscriptionStatus,
  asyncHandler(subscriptionsController.testMiddleware)
);

router.post(
  "/",
  auth(endPoints.createSubscription),
  asyncHandler(subscriptionsController.createSubscription)
);

router.put(
  "/:id",
  auth(endPoints.editSubscription),
  asyncHandler(subscriptionsController.updateSubscription)
);
router.delete(
  "/:id",
  auth(endPoints.deleteSubscription),
  asyncHandler(subscriptionsController.deleteSubscription)
);
router.get(
  "/",
  auth(endPoints.getAllSubscriptions),
  asyncHandler(subscriptionsController.getAllSubscriptions)
);
router.get(
  "/:id",
  auth(endPoints.getSubscriptionById),
  asyncHandler(subscriptionsController.getSubscriptionById)
);

export default router;

import Subscription from "../../db/models/subscriptions.js";

export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const { clinic_id, center_lab_id } = req.user; // Assuming user info is attached to req.user

    const subscription = await Subscription.findOne({
      where: {
        [clinic_id ? "clinic_id" : "center_lab_id"]: clinic_id || center_lab_id,
        status: "Active",
      },
    });

    if (!subscription) {
      return res
        .status(403)
        .json({ msg: "Subscription inactive or not found" });
    }

    // Check if the subscription is within the valid date range
    const currentDate = new Date();
    if (
      currentDate < subscription.start_date ||
      currentDate > subscription.end_date
    ) {
      return res.status(403).json({ msg: "Subscription has expired" });
    }

    next(); // Allow access if subscription is active
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ msg: "Server error during subscription check" });
  }
};

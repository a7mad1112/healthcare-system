import Subscription from "../../db/models/subscriptions.js";
import CenterLab from "../../db/models/center_labs.js";
import Clinic from "../../db/models/clinics.js";
import User from "../../db/models/user.js"; // Assuming you have a user model
import { roles } from "../roles.js";

export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const { role, email } = req.user; // Get role and email from the authenticated user
    let entity; // This will hold either a clinic or center lab

    // Retrieve the user based on the email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Based on user role, fetch the corresponding entity
    if (role === roles.Clinic) {
      entity = await Clinic.findOne({ where: { user_id: user.user_id } }); // Assuming clinicId is a foreign key in User
      if (!entity) {
        return res.status(404).json({ msg: "Clinic not found" });
      }
    } else if (role === roles.Center_Lab) {
      entity = await CenterLab.findOne({
        where: { center_lab_id: user.user_id },
      }); // Assuming centerLabId is a foreign key in User
      if (!entity) {
        return res.status(404).json({ msg: "Center Lab not found" });
      }
    } else {
      return res.status(403).json({ msg: "Unauthorized role" });
    }

    // Check for an active subscription based on the entity found
    const idKey = role === roles.Clinic ? "clinic_id" : "center_lab_id";
    const subscription = await Subscription.findOne({
      where: {
        [idKey]: entity[idKey],
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

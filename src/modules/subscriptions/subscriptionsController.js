import Subscription from "../../../db/models/subscriptions.js";
import Clinic from "../../../db/models/clinics.js";
import CenterLab from "../../../db/models/center_labs.js";

export const createSubscription = async (req, res) => {
  const { clinic_id, center_lab_id } = req.body;
  // Check if either clinic_id or center_lab_id is provided, but not both
  if ((!clinic_id && !center_lab_id) || (clinic_id && center_lab_id)) {
    return res.status(400).json({
      msg: "Specify either clinic_id or center_lab_id, but not both.",
    });
  }
  const newSubscription = await Subscription.create({
    clinic_id,
    center_lab_id,
  });
  res.status(201).json({
    msg: "Subscription created successfully",
    subscription: newSubscription,
  });
};

export const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { clinic_id, center_lab_id, start_date, end_date, status } = req.body;
  const updatedSubscription = await Subscription.update(
    { clinic_id, center_lab_id, start_date, end_date, status },
    { where: { subscription_id: id } }
  );
  res
    .status(200)
    .json({ msg: "Subscription updated successfully", updatedSubscription });
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscription.destroy({ where: { subscription_id: id } });
    res.status(200).json({ msg: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({ msg: "Server error while deleting subscription" });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status === "Active" ? { status: "Active" } : {};
    const subscriptions = await Subscription.findAll({
      where: whereCondition,
      include: [{ model: Clinic }, { model: CenterLab }],
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ msg: "Server error while fetching subscriptions" });
  }
};

export const getSubscriptionById = async (req, res) => {
  const { id } = req.params;
  const whereCondition = { subscription_id: id };
  const subscription = await Subscription.findOne({
    where: whereCondition,
    include: [{ model: Clinic }, { model: CenterLab }],
  });
  if (!subscription) {
    return res.status(404).json({ msg: "Subscription not found" });
  }
  return res.status(200).json(subscription);
};

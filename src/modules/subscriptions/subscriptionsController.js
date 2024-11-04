import Subscription from "../../../db/models/subscriptions.js";
import Clinic from "../../../db/models/clinics.js";
import CenterLab from "../../../db/models/center_labs.js";

export const createSubscription = async (req, res, next) => {
  console.log("Request Body:", req.body); // Log the incoming request body

  const { clinic_id, center_lab_id } = req.body;

  // Check if either clinic_id or center_lab_id is provided, but not both
  if ((!clinic_id && !center_lab_id) || (clinic_id && center_lab_id)) {
    return next(
      new Error("Specify either clinic_id or center_lab_id, but not both.", {
        cause: 400,
      })
    );
  }

  try {
    const newSubscription = await Subscription.create({
      clinic_id,
      center_lab_id,
    });

    res.status(201).json({
      msg: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error); // Log any errors
    next(new Error("Failed to create subscription", { cause: 500 }));
  }
};

export const updateSubscription = async (req, res, next) => {
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

export const deleteSubscription = async (req, res, next) => {
  const { id } = req.params;
  await Subscription.destroy({ where: { subscription_id: id } });
  res.status(200).json({ msg: "Subscription deleted successfully" });
};

export const getAllSubscriptions = async (req, res) => {
  const { status } = req.query;
  const whereCondition = status === "Active" ? { status: "Active" } : {};
  const subscriptions = await Subscription.findAll({
    where: whereCondition,
    include: [{ model: Clinic }, { model: CenterLab }],
  });
  res.status(200).json(subscriptions);
};

export const getSubscriptionById = async (req, res) => {
  const { id } = req.params;
  const whereCondition = { subscription_id: id };
  const subscription = await Subscription.findOne({
    where: whereCondition,
    include: [{ model: Clinic }, { model: CenterLab }],
  });
  if (!subscription) {
    return next(new Error("Subscription not found.", { cause: 404 }));
  }
  return res.status(200).json(subscription);
};

export const testMiddleware = async (req, res) => {
  try {
    return res.status(200).json({ msg: "testMiddleware" });
  } catch (err) {
    return res.json(err);
  }
};

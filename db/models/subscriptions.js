import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import Clinic from "./clinics.js";
import CenterLab from "./center_labs.js";

class Subscription extends Model {}

Subscription.init(
  {
    subscription_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clinic_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Clinic,
        key: "clinic_id",
      },
      allowNull: true, // Nullable in case the subscription is for a center lab only
    },
    center_lab_id: {
      type: DataTypes.INTEGER,
      references: {
        model: CenterLab,
        key: "center_lab_id",
      },
      allowNull: true, // Nullable in case the subscription is for a clinic only
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => {
        const now = new Date();
        return new Date(now.setFullYear(now.getFullYear() + 1));
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  { tableName: "Subscriptions", sequelize, modelName: "Subscription" }
);

// Define relationships
Subscription.belongsTo(Clinic, { foreignKey: "clinic_id" });
Subscription.belongsTo(CenterLab, { foreignKey: "center_lab_id" });

export default Subscription;

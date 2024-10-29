// admins.js
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection.js"; // Fix import here
import User from "./user.js";

class Admin extends Model {}

Admin.init(
  {
    admin_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Admin",
  }
);

// Define the relationship
Admin.belongsTo(User, { foreignKey: "user_id" });

export default Admin;

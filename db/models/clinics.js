import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import User from "./user.js";

class Clinic extends Model {}

Clinic.init(
  {
    clinic_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
  },
  {
    sequelize,
    modelName: "Clinic",
  }
);

// Define relationships
Clinic.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

export default Clinic;

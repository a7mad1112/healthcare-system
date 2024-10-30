import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection.js";
import User from "./user.js";

class CenterLab extends Model {}

CenterLab.init(
  {
    center_lab_id: {
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
    modelName: "CenterLab",
  }
);

// Define relationships
CenterLab.belongsTo(User, { foreignKey: "user_id" });

export default CenterLab;

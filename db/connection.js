// connection.js
import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const connectDB = async () => {
  try {
    await sequelize.sync();
    console.log("DB connected");
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
};

// Export both `sequelize` instance and `connectDB`
export { sequelize, connectDB };
export default connectDB;

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
  return await sequelize
    .sync()
    .then((res) => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB;

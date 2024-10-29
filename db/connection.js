import Sequelize from "sequelize";
const sequelize = new Sequelize("clinics", "root", "", {
  host: "localhost",
  dialect: "mysql", // Specify the correct SQL dialect here, e.g., 'mysql', 'postgres', etc.
});

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

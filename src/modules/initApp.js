import connectDB from "../../db/connection.js";
import { globalErrorHandler } from "../../utils/errorHandler.js";

import cors from "cors";
const initApp = async (app, express) => {
  app.use(cors());
  connectDB();
  app.use(express.json());
  app.use("*", (req, res) => res.status(404).json({ msg: "page not found" }));
  app.use(globalErrorHandler);
};

export default initApp;

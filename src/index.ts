
import 'module-alias/register';
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import compression from "compression";
import setting from "./core/config/application";
import dbConnect from "./core/config/database";
import userRoutes from "./api/route/customer";
import managerRoutes from "./api/route/manager";
import { errorHandler } from "./api/middleware/handleErrors";
import categoryRoute from './api/route/category'
import carRoute from './api/route/car'

const app = express();
const port = setting.port;

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(express.json());
app.use("/api/v1/customers", userRoutes);
app.use("/api/v1/managers", managerRoutes);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/cars", carRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    errorHandler(err, req, res, next);
  } else {
    next();
  }
});

const startServer = async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
  });
};

startServer();

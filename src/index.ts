
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
import purchaseRoute from './api/route/purchase';
import { getRedisClient } from './core/utils/redis';

const app = express();
const port = setting.port;

app.use(
  cors({
    credentials: true,
  })
);

const appVersion = "/api/v1";

app.use(compression());
app.use(express.json());
app.use(`${appVersion}/customers`, userRoutes);
app.use(`${appVersion}/managers`, managerRoutes);
app.use(`${appVersion}/categories`, categoryRoute);
app.use(`${appVersion}/cars`, carRoute);
app.use(`${appVersion}/purchases`, purchaseRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    errorHandler(err, req, res, next);
  } else {
    next();
  }
});

const startServer = async () => {
  await getRedisClient();
  await dbConnect();
  app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
  });
};

startServer();

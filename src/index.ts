import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// import bodyParser from "body-parser";
import compression from "compression";
import setting from "./core/config/application";
import dbConnect from "./core/config/database";
import userRoutes from "./api/route/customer";
import managerRoutes from "./api/route/manager";
import { errorHandler } from "./api/middleware/handleErrors";

const app = express();
const port = setting.port;

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(express.json())
// app.use(bodyParser.json());
app.use("/api", userRoutes)
app.use("/api", managerRoutes)

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

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import compression from "compression";
import setting from "./core/config/application";
import dbConnect from "./core/config/database";
import userRoutes from "./api/route/customer";

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



const startServer = async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
  });
};
startServer();

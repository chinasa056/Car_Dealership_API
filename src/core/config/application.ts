import dotenv from 'dotenv';
dotenv.config();

const setting = {
  port: process.env.APP_PORT as string,
  mongodb_uri: process.env.MONGODB_URI as string,
  secret: process.env.JWT_SECRET as string
};

export default setting;

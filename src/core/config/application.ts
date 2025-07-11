import dotenv from 'dotenv';
dotenv.config();

const setting = {
  port: process.env.APP_PORT as string,
  mongodb_uri: process.env.MONGODB_URI as string,
  jwt: {
  secret: process.env.JWT_SECRET as string
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.API_KEY as string,
    api_secret: process.env.API_SECRET as string
  }
};

export default setting;

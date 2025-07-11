import { v2 as cloudinary } from 'cloudinary';
import setting from './application';

cloudinary.config({
  cloud_name: setting.cloudinary.cloud_name,
  api_key: setting.cloudinary.api_key,
  api_secret: setting.cloudinary.api_secret
});

export default cloudinary;
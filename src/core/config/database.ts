import mongoose from 'mongoose';
import setting from './application';
const db = setting.mongodb_uri;

const dbConnect = async () => {
    mongoose.connect(db)
      .then(() => {
        console.log('MongoDB connected successfully');
      })
      .catch((error: Error) => {
        console.error('MongoDB connection error:', error);
    });
};

export default dbConnect;

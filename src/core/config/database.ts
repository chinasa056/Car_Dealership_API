import mongoose from 'mongoose';
const db = process.env.MONGODB_URI;

mongoose.Promise = Promise;

mongoose.connect(db)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);
});

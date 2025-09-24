// ./config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 2000,
      family: 4,
    });
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
    });
    console.log("Connected To The DB");
  } catch (error) {
    console.error("Error Connecting To The DB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch((e) => console.log(`Error: ${e}`))
}

export default connectDB
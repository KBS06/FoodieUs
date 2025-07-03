import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://khushibshah06:foodie123@cluster0.vav8gh3.mongodb.net/FoodieUs')
  .then(() => console.log('DB CONNECTED'))
}

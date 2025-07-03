{
  /**Installed bcrypt -> library for hashing of passwords and compare them
  body-parser -> middleware for converting incoming json or url in js
  cors -> express middleware that enables cross origin requests to your api
  dotenv -> loading and creation of dotenv file
  express -> web framework 
  jsonwebtoken -> for creating tokens
  mongoose -> for creating schemas
  multer -> for uploading images
  nodemon -> helps in automatically restarting your webserver
  validator -> for validation of emails
  type: module -> ES6 module
  cookie-parser -> taking tokens and data from user as cookies*/
}

import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";

import path from "path";
import { fileURLToPath } from "url";
import itemRouter from "./routes/itemRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//MIDDLEWARE

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB
connectDB();

//ROUTES

app.use("/api/user", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

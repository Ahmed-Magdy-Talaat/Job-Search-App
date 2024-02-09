// server.js
import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "./utils/dbconnection.js";
import { handleErrResponse } from "./middlewares/errorsResponse.js";
import userRouter from "./user/user.route.js";
import companyRouter from "./company/company.routes.js";
import jobRouter from "./job/job.routes.js";
import { multerMiddle } from "./middlewares/multermiddle.js";

const app = express();

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
connectDB();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/user", userRouter);
app.use("/job", jobRouter); // Use the jobRouter here
app.use("/company", companyRouter);
app.post("/upload", multerMiddle().single("image"), (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.file,
  });
});
app.use(handleErrResponse);
app.listen(port, () => console.log(`app is listening on port ${port}`));

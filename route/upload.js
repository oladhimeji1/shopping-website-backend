import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import User from "../model/user.js";
import { cloud_name, api_key, api_secret } from "../config/config.js";

const uploadRouter = express.Router();

// Multer setup for uploading photos
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png)$/i)) {
    return cb("Only image files are allowed", false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
}).single("image");

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

// Route for updating user profile picture
uploadRouter.put("/user/updatepic/:id", upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(403).json({ message: "No file selected" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const userImgUrl = result.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { image: userImgUrl },
      { new: true }
    );

    return res.status(201).json({
      message: "Profile photo updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user profile photo error:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
});

export default uploadRouter;

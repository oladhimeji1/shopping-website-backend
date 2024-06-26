// userPhotoController.js

const multer = require ("multer");
const fs = require ("fs");

// Multer setup for uploading photos to the "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolderPath = "./uploads";

    // Check if the "uploads" folder exists, create it if it doesn't
    fs.access(uploadFolderPath, fs.constants.F_OK, (err) => {
      if (err) {
        // "uploads" folder does not exist, create it
        fs.mkdir(uploadFolderPath, (err) => {
          if (err) {
            console.error('Error creating "uploads" folder:', err);
          } else {
            console.log('"uploads" folder created successfully');
            cb(null, uploadFolderPath);
          }
        });
      } else {
        // "uploads" folder already exists
        cb(null, uploadFolderPath);
      }
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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

// upload local
const updateUserPhoto = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading photo:", err);
        return res.status(400).json({ message: "Error uploading photo" });
      }

      if (!req.file) {
        return res.status(403).json({ message: "No file selected" });
      }

      const userImgUrl = "/uploads/" + req.file.filename;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { image: userImgUrl },
        { new: true }
      );

      return res.status(201).json({
        message: "Profile photo updated",
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error("Update user profile photo error:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

// cloudinary upload
// cloudinary

// userPhotoController.js

// Multer setup for uploading photos
const storageC = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadC = multer({
  storage: storageC,
  fileFilter: imageFilter,
}).single("image");

const updateUserPhotoCloudinary = async (req, res) => {
  try {
    uploadC(req, res, async (err) => {
      if (err) {
        console.error("Error uploading photo:", err);
        return res.status(400).json({ message: "Error uploading photo" });
      }

      if (!req.file) {
        return res.status(403).json({ message: "No file selected" });
      }

      cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret,
      });
      console.log("ggogooogooooooogo" + config.cloud_name, config.api_key);
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
    });
  } catch (error) {
    console.error("Update user profile photo error:", error.message);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Something went wrong, please try again",
    });
  }
};

module.exports = {updateUserPhoto,
  updateUserPhotoCloudinary}
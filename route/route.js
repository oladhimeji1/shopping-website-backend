const express = require ("express");
const router = express.Router();
const {
  AddItem
} = require ("../controller/itemsController");

// const {
//   updateUserPhoto,
//   updateUserPhotoCloudinary,
// } = require ("../controller/uploadcontroller");

//user  route
router.post("/add-item", AddItem);
// router.post("/newuser", RegisterUser);
// router.post("/login", LoginUser);
// router.put("/updateprofile/:id", UpdateProfile);
// router.get("/user/:id", getOneUserById);
// router.get("/users", getAllUsers);
// router.delete("/user/:id", DeleteUser);
// router.put("/user/updatepic/:id", updateUserPhoto);
// router.put("/user/updateprofile/:id", updateUserPhotoCloudinary);


module.exports = router
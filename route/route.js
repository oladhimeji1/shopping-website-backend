const express = require ("express");
const router = express.Router();
// const app = express();

const getItemsRouter = require("../controller/getItems");
const addItemsRouter = require("../controller/addItems");
const getImage = require("../controller/getImage");

//user route
router.get("/get-items", getItemsRouter);
router.get("/images/:id", getImage);
router.post("/add-item", addItemsRouter);

module.exports = router;
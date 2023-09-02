const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
const todoRoute = require("./todoRoute");
const authOnly = require("../middlewares/auth");

router.use("/", userRoute);
router.use("/todo", authOnly, todoRoute);

module.exports = router;

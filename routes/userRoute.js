const express = require("express");

const userController = require("../controllers/userController");
const authOnly = require("../middlewares/auth");
const router = express.Router();

router.post("/register", userController.register);
router.patch("/update", authOnly, userController.updateUser);
router.post("/login", userController.login);
router.get("/user", authOnly, userController.getUser);
module.exports = router;

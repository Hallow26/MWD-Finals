const express = require("express");
// Express routing component
const router = express.Router();
const userController = require("../controllers/User-Controllers.js");
const { verify } = require("../auth.js");

// User Registration
router.post("/register", userController.registerUser);

// User Login
router.post("/login", userController.loginUser);

// Check if email exists
router.post("/check-email", userController.checkEmail);

// Get user details (POST method)
router.post("/details", verify, userController.getProfile);

// Get user details (GET method)
router.get("/details", verify, userController.getProfile);

// Get user details
router.post("/enroll", verify, userController.enroll);

// update password
router.put("/update-password", verify, userController.updatePassword);



module.exports = router;
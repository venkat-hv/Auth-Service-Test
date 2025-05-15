const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/google", authController.handleGoogleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  authController.handleGoogleAuthCallback
);
router.get("/logout", authController.handleLogout)

router.get("/failure", authController.handleGoogleAuthFailure);

module.exports = router;
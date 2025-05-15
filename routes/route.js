const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get("/me", controller.getSessionUser);

module.exports = router;

const express = require("express");
const passport = require("passport");

const router = express.Router();

const UserController = require("../controllers/userController");
const RiskFactorController = require("../controllers/RiskFactorController");
router.post("/GetClientKey", UserController.getClientKey);
router.post("/Login", UserController.verifyLogin);
router.post("/getRiskFactor", RiskFactorController.sp_get_riskfactor_masters);
module.exports = router;

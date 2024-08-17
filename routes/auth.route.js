const express = require("express");
const passport = require("passport");

const router = express.Router();

const UserController = require("../controllers/userController");
const RiskFactorController = require("../controllers/RiskFactorController");

router.post("/GetClientKey", UserController.getClientKey);
router.post("/Login", UserController.verifyLogin);
// RiskFactor routes
router.post("/GetRiskFactorMaster", RiskFactorController.getRiskFactorMaster);
router.post("/GetRiskdetails", RiskFactorController.getRiskDetails);
router.post(
  "/RiskFactorInsertUpdate",
  RiskFactorController.riskFactorInsertUpdate
);
module.exports = router;

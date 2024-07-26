const express = require("express");
const passport = require("passport");

const router = express.Router();

const UserController = require("../controllers/userController");
const RiskFactorController = require("../controllers/RiskFactorController");
router.post("/GetClientKey", UserController.getClientKey);
router.post("/Login", UserController.verifyLogin);
router.post(
  "/GetRiskFactorMaster",
  RiskFactorController.sp_get_riskfactor_masters
);
router.post("/GetRiskdetails", RiskFactorController.getRiskDetails);
router.post(
  "/RiskFactorInsertUpdate",
  RiskFactorController.insertOrUpdateRiskFactor
);
module.exports = router;

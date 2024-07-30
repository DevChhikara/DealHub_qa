const {
  sp_get_riskfactor_masters,
  sp_get_riskdetails,
  sp_insert_update_riskfactor,
} = require("../../controllers/RiskFactorController");

class IRiskFactorService {
  sp_get_riskfactor_masters(model) {
    throw new Error("Method sp_get_riskfactor_masters must be implemented.");
  }

  sp_insert_update_riskfactor(filters) {
    throw new Error("Method sp_insert_update_riskfactor must be implemented.");
  }

  sp_get_riskdetails(model) {
    throw new Error("Method sp_get_riskdetails must be implemented.");
  }
}

module.exports = IRiskFactorService;

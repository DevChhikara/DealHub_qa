const IRiskFactorService = require("./IRiskFactorService").default;
const {
  sp_get_riskfactor_masters,
  sp_get_riskdetails,
  sp_insert_update_riskfactor,
} = require("../../controllers/RiskFactorController");

class RiskFactorService extends IRiskFactorService {
  sp_get_riskfactor_masters(model) {
    return "result from sp_get_riskfactor_masters";
  }

  sp_insert_update_riskfactor(filters) {
    return [{ message: "result from sp_insert_update_riskfactor" }];
  }

  sp_get_riskdetails(model) {
    return "result from sp_get_riskdetails";
  }
}
module.exports = RiskFactorService;

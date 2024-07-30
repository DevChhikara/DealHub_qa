const RiskFactorService = require("./RiskFactorService");
class GetObjectCompanyWise {
  static getObject(companyName) {
    let service;
    switch (companyName) {
      case "MLL":
        service = new RiskFactorService();
        break;
      default:
        service = new RiskFactorService();
        break;
    }
    return service;
  }
}

module.exports = GetObjectCompanyWise;

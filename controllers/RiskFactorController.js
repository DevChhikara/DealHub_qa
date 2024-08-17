const riskFactorService = require("../services/GetObjectCompany/RiskFactorService");
const getRiskFactorMaster = async (req, res) => {
  try {
    const model = req.body;
    const result = await riskFactorService.getRiskFactorMasters(model);
    res.json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getRiskDetails = async (req, res) => {
  try {
    const id = req.body.userid;
    const query = `CALL sp_get_riskdetails(?)`;
    const [results] = await db.query(query, id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const riskFactorInsertUpdate = async (req, res) => {
  try {
    const filters = req.body;
    const result = await riskFactorService.insertOrUpdateRiskFactor(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getRiskFactorMaster,
  getRiskDetails,
  riskFactorInsertUpdate,
};

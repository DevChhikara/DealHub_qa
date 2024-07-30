const ASEncryptDecrypt = require("../services/ASEncryptDecrypt");
const getObjectCompanyWise = require("../services/GetObjectCompany/GetObjectCompanyWise");
function sp_get_riskfactor_masters(model) {
  return (req, res) => {
    if (!model) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: errors.array(),
      };
      return res.status(400).json(result);
    }

    let userid = ASEncryptDecrypt.decryptStringAES(
      CommonFunctions.CommonKeyClass.Key,
      model.userid
    );
    model.userid = userid;

    let _RiskFactorService = getObjectCompanyWise(model.companyName);
    let json = _RiskFactorService.sp_get_riskfactor_masters(model);

    if (json === "" || json === "error") {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    } else {
      const randomnum =
        Math.floor(Math.random() * (999999 - 110000 + 1)) + 110000;
      let Keynew = "0c24f9de!b" + randomnum;
      let data = ASEncryptDecrypt.encryptStringAES(Keynew, json);
      data = `${data}*$${randomnum}`;
      return res.status(200).send(data);
    }
  };
}

function sp_get_riskdetails(model) {
  return (req, res) => {
    if (!model) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: errors.array(),
      };
      return res.status(400).json(result);
    }

    let _RiskFactorService = getObjectCompanyWise(model.companyName);
    let json = _RiskFactorService.sp_get_riskdetails(model);

    if (json === "" || json === "error") {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    } else {
      const randomnum =
        Math.floor(Math.random() * (999999 - 110000 + 1)) + 110000;
      let Keynew = "0c24f9de!b" + randomnum;
      let data = ASEncryptDecrypt.encryptStringAES(Keynew, json);
      data = `${data}*$${randomnum}`;
      return res.status(200).send(data);
    }
  };
}

function sp_insert_update_riskfactor(models) {
  return (req, res) => {
    if (!models || !Array.isArray(models) || models.length === 0) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: errors.array(),
      };
      return res.status(400).json(result);
    }

    let _RiskFactorService = getObjectCompanyWise(models[0].companyName);

    models.forEach((model) => {
      let userid = ASEncryptDecrypt.decryptStringAES(
        CommonFunctions.CommonKeyClass.Key,
        model._created_by
      );
      model._created_by = userid;
    });

    let _commanmessges = _RiskFactorService.sp_insert_update_riskfactor(models);

    if (_commanmessges) {
      if (_commanmessges.length !== 0) {
        return res.status(200).json(_commanmessges);
      } else {
        const result = {
          MsgNo: http.STATUS_CODES[400],
          MsgType: "E",
          Message: "Common error message",
        };
        return res.status(400).json(result);
      }
    } else {
      const result = {
        MsgNo: http.STATUS_CODES[400],
        MsgType: "E",
        Message: "Common error message",
      };
      return res.status(400).json(result);
    }
  };
}

module.exports = {
  sp_get_riskfactor_masters,
  sp_get_riskdetails,
  sp_insert_update_riskfactor,
};

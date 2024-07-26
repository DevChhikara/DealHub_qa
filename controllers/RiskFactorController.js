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

    let userid = decryptStringAES(
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
      let data = encryptStringAES(Keynew, json);
      data = `${data}*$${randomnum}`;
      return res.status(200).send(data);
    }
  };
}

module.exports = {
  sp_get_riskfactor_masters,
};

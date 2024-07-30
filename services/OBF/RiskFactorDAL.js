const mysql = require("mysql");
const config = require("./config");
const logger = require("./logger");

class RiskFactorDAL {
  static sp_get_riskfactor_masters(model) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config.connectionString);
      const query = "CALL sp_get_riskfactor_masters(?, ?)";

      conn.query(query, [model.userid, model.companyName], (err, results) => {
        if (err) {
          const errorDetails = `error in getmasterobfcreation ${new Date().toString()}\n${err.toString()}`;
          this.writelogobfcreation(errorDetails);
          return reject("error");
        }

        resolve(JSON.stringify(results, null, 4));
      });
    });
  }

  static sp_insert_update_riskfactor(filters) {
    return new Promise((resolve, reject) => {
      let commanMessages = [];

      filters.forEach((filter, index) => {
        const conn = mysql.createConnection(config.connectionString);
        const query = "CALL sp_insert_update_riskfactor(?, ?, ?, ?)";

        conn.query(
          query,
          [
            filter._dh_header_id,
            filter._riskfactor_id,
            filter._risklevel_id,
            filter._created_by,
          ],
          (err, results) => {
            if (err) {
              const errorDetails = `error in riskfactor save ${new Date().toString()}\n${err.toString()}`;
              this.writelogobfcreation(errorDetails);

              commanMessages.push({
                status: "Failed",
                message: "Error in saving parameters",
              });
              return reject(commanMessages);
            }

            commanMessages.push(...results);

            if (index === filters.length - 1) {
              this.sp_insert_riskfactorcomment(filters[0])
                .then(() => resolve(commanMessages))
                .catch(() => resolve(commanMessages));
            }
          }
        );
      });
    });
  }

  static sp_insert_riskfactorcomment(filter) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config.connectionString);
      const query = "CALL sp_insert_riskfactorcomment(?, ?, ?)";

      conn.query(
        query,
        [filter._dh_header_id, filter._created_by, filter.riskfactorcomment],
        (err, results) => {
          if (err) {
            const errorDetails = `error in risk factor comment save ${new Date().toString()}\n${err.toString()}`;
            this.writelogobfcreation(errorDetails);
            return reject("error");
          }

          resolve(results);
        }
      );
    });
  }

  static sp_get_riskdetails(model) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config.connectionString);
      const query = "CALL sp_get_riskdetails(?)";

      conn.query(query, [model._dh_header_id], (err, results) => {
        if (err) {
          const errorDetails = `error in getmasterobfcreation ${new Date().toString()}\n${err.toString()}`;
          this.writelogobfcreation(errorDetails);
          return reject("error");
        }

        resolve(JSON.stringify(results, null, 4));
      });
    });
  }

  static writelogobfcreation(errordetails) {
    logger.logEvent(config.logFilePath, errordetails, true);
  }
}

module.exports = RiskFactorDAL;

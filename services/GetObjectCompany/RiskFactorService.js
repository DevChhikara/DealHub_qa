const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool(config.mysql);

const getRiskFactorMasters = (model) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error in connection:", err);
        reject(err);
      }
      const query = `CALL sp_get_riskfactor_masters(?, ?)`;
      connection.query(
        query,
        [model.userid, model.companyName],
        (error, results) => {
          connection.release();
          if (error) {
            console.error("Error executing query:", error);
            reject(error);
          }
          resolve(JSON.stringify(results));
        }
      );
    });
  });
};

const insertOrUpdateRiskFactor = (filters) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error in connection:", err);
        reject(err);
      }

      const query = `CALL sp_insert_update_riskfactor(?)`;
      connection.query(query, [JSON.stringify(filters)], (error, results) => {
        connection.release();
        if (error) {
          console.error("Error executing query:", error);
          reject(error);
        }
        resolve(results);
      });
    });
  });
};
const getRiskDetails = (model) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error in connection:", err);
        reject(err);
      }

      const query = `CALL sp_get_riskdetails(?, ?)`;
      connection.query(
        query,
        [model.userid, model.companyName],
        (error, results) => {
          connection.release();
          if (error) {
            console.error("Error executing query:", error);
            reject(error);
          }
          resolve(JSON.stringify(results));
        }
      );
    });
  });
};

module.exports = {
  getRiskFactorMasters,
  insertOrUpdateRiskFactor,
  getRiskDetails,
};

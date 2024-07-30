const mysql = require("mysql");
const config = require("./config");

class SFDataUpdationDAL {
  static sp_insert_sfdata(sfData) {
    return new Promise((resolve, reject) => {
      let response = {
        Response: [],
      };

      sfData.SFData.forEach((item, index) => {
        const conn = mysql.createConnection(config.connectionString);
        const query =
          "CALL sp_insert_sf_data(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        conn.query(
          query,
          [
            item._sf_opportunity_id,
            item._sf_opportunity_name,
            item._sf_solutioncategory,
            item._sf_type_of_service,
            item._sf_vertical,
            item._sf_sector,
            item._sf_subsector,
            item._sf_project_name,
            item._sf_cust_name,
            item._sf_project_type,
            item._sf_project_primary_loc,
            item._sf_project_brief,
            item._sf_record_id,
          ],
          (err, results) => {
            if (err) {
              return reject(err);
            }

            response.Response.push(...results);

            if (index === sfData.SFData.length - 1) {
              resolve(response);
            }
          }
        );
      });
    });
  }

  static get_sf_data_by_opportunity_id(dhOpportunityId) {
    return new Promise((resolve, reject) => {
      const conn = mysql.createConnection(config.connectionString);
      const query =
        "SELECT * FROM dh_sf_data WHERE sf_opportunity_id = ? LIMIT 1";

      conn.query(query, [dhOpportunityId], (err, results) => {
        if (err) {
          return reject(err);
        }

        if (results.length > 0) {
          const sfDetails = {
            _sf_cust_name: results[0].sf_cust_name,
            _sf_opportunity_id: results[0].sf_opportunity_id,
            _sf_vertical: results[0].sf_vertical,
            _sf_project_name: results[0].sf_project_name,
            _sf_project_type: results[0].sf_project_type,
            _sf_project_primary_loc: results[0].sf_project_primary_loc,
          };
          resolve(sfDetails);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = SFDataUpdationDAL;

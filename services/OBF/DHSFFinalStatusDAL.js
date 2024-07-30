const mysql = require("mysql");
const config = require("config");
const connectionString = config.get("connectionString");

class DHSFFinalStatusDAL {
  static async getDHSFFinalStatusData(data) {
    let lstmodelStatus = [];
    let response = { Response: [] };

    for (let item of data.DHData) {
      try {
        const connection = mysql.createConnection(connectionString);
        connection.connect();

        const query = `
                    CALL sp_getDHData_Status(?, ?, ?, ?);
                `;
        const params = [item._param, item._userid, item._oppid, item._obfid];

        connection.query(query, params, (error, results) => {
          if (error) {
            throw error;
          }
          for (let row of results[0]) {
            let res = {
              dh_code: row.dh_code || null,
              opportunity_id: row.opportunity_id || null,
              is_loi_po_uploaded: row.is_loi_po_uploaded || null,
              total_revenue: row.total_revenue || null,
              total_cost: row.total_cost || null,
              capex: row.capex || null,
              total_margin: row.total_margin || null,
              payment_terms: row.payment_terms || null,
              total_project_life: row.total_project_life || null,
              ebt: row.ebt || null,
              irr_surplus_cash: row.irr_surplus_cash || null,
              irr_borrowed_fund: row.irr_borrowed_fund || null,
              Final_Approval_date: row.Final_Approval_date
                ? new Date(row.Final_Approval_date).toISOString()
                : null,
              version_name: row.version_name || null,
              final_status: row.final_status || null,
              created_by: row.created_by || null,
              sf_record_id: row.sf_record_id || null,
            };
            lstmodelStatus.push(res);
          }
          response.Response = lstmodelStatus;
        });

        connection.end();
      } catch (error) {
        throw error;
      }
    }
    return response;
  }
}

module.exports = DHSFFinalStatusDAL;

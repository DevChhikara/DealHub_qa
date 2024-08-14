const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn');


async function getObfDetailsForPpl(dhId) {
    const query = `
        SELECT dm.*, dh.dh_header_id, dh.domain_id 
        FROM dh_headers dh 
        JOIN dh_main dm ON dh.dh_id = dm.dh_id 
        WHERE dm.dh_id = :dhId 
        LIMIT 1
    `;

    try {
        const results = await sequelize.query(query, {
            replacements: { dhId },
            type: QueryTypes.SELECT
        });

        if (results.length > 0) {
            const result = results[0];
            const obfParameters = {
                _dh_project_name: result.dh_project_name,
                _dh_id: result.dh_id,
                _projecttype: result.domain_id,
                _dh_location: result.dh_location,
                _opportunity_id: result.opportunity_id,
                _customer_name: result.customer_name,
                _vertical_id: result.vertical_id
            };
            return obfParameters;
        } else {
            return null; // or handle the case when no record is found
        }
    } catch (error) {
        console.error('Error fetching OBF details:', error);
        throw error;
    }
}

/// 

module.exports = { getObfDetailsForPpl };
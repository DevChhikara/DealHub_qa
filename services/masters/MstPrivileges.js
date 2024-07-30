const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn');
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');
const { MstPrivilegeParameters } = require('../../models/Dashboard/ObfCreationDetailsParameters');

const getMstPrivilege = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_privilege(:_user_id)',
            {
                replacements: { _user_id: model._user_id },
                type: QueryTypes.SELECT
            }
        );

        return JSON.stringify(result, null, 2);
    } catch (error) {
        writelogobfcreation(error.toString());
        return "error";
    }
};

const updateMstPrivilege = async (model) => {
    const commonmessages = [];
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_privilege(:_privilege_Id, :_privilege_name, :_active, :_user_id)',
            {
                replacements: {
                    _privilege_Id: model._privilege_Id,
                    _privilege_name: model._privilege_name,
                    _active: model._active,
                    _user_id: model._user_id
                },
                type: QueryTypes.SELECT
            }
        );

        result.forEach(row => {
            commonmessages.push({
                status: row.status,
                message: row.message
            });
        });

        return commonmessages;
    } catch (error) {
        writelogobfcreation(error.toString());

        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
};

const writelogobfcreation = (errordetails) => {
    const logFilePath = path.resolve(process.env.LOG_FILEPATH || './logs');
    const logger = new WritetoLogFile();
    logger.logEvent(logFilePath, errordetails, true);
};

module.exports = {
    getMstPrivilege,
    updateMstPrivilege
};

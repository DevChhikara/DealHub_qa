const { Sequelize, QueryTypes } = require('sequelize');
const path = require('path');
const sequelize = require('../config/dbConn');
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');
const { commanmessages} = require('../../models/Dashboard/ObfCreationDetailsParameters');  


const getMstFunctions = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_functions(:_user_id)',
            {
                replacements: { _user_id: model._user_id },
                type: QueryTypes.SELECT
            }
        );

        return JSON.stringify(result, null, 2);
    } catch (error) {
        writelogobfcreation(error.toString());
        return 'error';
    }
};

const updateMstFunctions = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_functions(:_function_id, :_function_code, :_function_name, :_active, :_user_id)',
            {
                replacements: {
                    _function_id: model._function_id,
                    _function_code: model._function_code,
                    _function_name: model._function_name,
                    _active: model._active,
                    _user_id: model._user_id
                },
                type: QueryTypes.SELECT
            }
        );

        const commanmessagesList = result.map(row => {
            return new commanmessages({
                status: row.status,
                message: row.message
            });
        });

        return commanmessagesList;
    } catch (error) {
        writelogobfcreation(error.toString());

        return [
            new commanmessages({
                status: 'Failed',
                message: 'Error in saving parameters'
            })
        ];
    }
};

function writelogobfcreation(errordetails) {
    const logFilePath = path.resolve(process.env.LOG_FILEPATH || './logs');
    const logger = new WritetoLogFile();
    logger.logEvent(logFilePath, errordetails, true);
}

module.exports = {
    getMstFunctions,
    updateMstFunctions
};

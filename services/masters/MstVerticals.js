const { Sequelize, QueryTypes } = require('sequelize');
const path = require('path');
const sequelize = require('../config/dbConn');
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');
const { commanmessges } = require('../../models/Dashboard/ObfCreationDetailsParameters'); 

const getMstDoaMatrixMessages = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_doa_matrix_messages(:_user_id)',
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

const updateMstDoaMatrixMessages = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_doa_matrix_messages(:_DOA_Matrix_Id, :_Message, :_MessageFor, :_Prefix, :_user_id)',
            {
                replacements: {
                    _DOA_Matrix_Id: model._DOA_Matrix_Id,
                    _Message: model._Message,
                    _MessageFor: model._MessageFor,
                    _Prefix: model._Prefix,
                    _user_id: model._user_id
                },
                type: QueryTypes.SELECT
            }
        );

        const commanmessgesList = result.map(row => {
            return new commanmessges({
                status: row.status,
                message: row.message
            });
        });

        return commanmessgesList;
    } catch (error) {
        writelogobfcreation(error.toString());

        return [
            new commanmessges({
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
    getMstDoaMatrixMessages,
    updateMstDoaMatrixMessages
};

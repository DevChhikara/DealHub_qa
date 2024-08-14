const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn'); 
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');

const getMstBranch = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_branch(:_user_id)',
            {
                replacements: { _user_id: model._user_id },
                type: QueryTypes.SELECT
            }
        );

        return JSON.stringify(result, null, 2);
    } catch (error) {
        writelogobfcreation(error.toString());
        throw new Error('Error in getMstBranch');
    }
};

const updateMstBranch = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_branch(:_branch_id, :_branchname, :_Active, :_user_id)',
            {
                replacements: {
                    _branch_id: model._branch_id,
                    _branchname: model._branchname,
                    _Active: model._active,
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
    const logFilePath = path.resolve(process.env.LOG_FILEPATH || './logs'); // Use environment variable or default path
    const logger = new WritetoLogFile();
    logger.logEvent(logFilePath, errordetails, true);
}


module.exports = {
    getMstBranch,
    updateMstBranch
};

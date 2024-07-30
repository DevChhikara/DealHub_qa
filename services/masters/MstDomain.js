const { Sequelize, QueryTypes } = require('sequelize');
const path = require('path');
const sequelize = require('../config/dbConn');
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');
const { commanmessages} = require('../../models/Dashboard/ObfCreationDetailsParameters'); 
const { MstDomainParameters } = require('../../models/masters/MstDomainParameters');

const getMstDomainById = async (domainId) => {
    try {
        const [result] = await sequelize.query(
            'SELECT * FROM mst_domains WHERE domain_id = :domainId AND active = 1 LIMIT 1',
            {
                replacements: { domainId: domainId },
                type: QueryTypes.SELECT
            }
        );

        return new MstDomainParameters({
            _domain_id: result.domain_id,
            _domain_code: result.domain_code,
            _domain_name: result.domain_name
        });
    } catch (error) {
        writelogobfcreation(error.toString());
        throw new Error('Error in getMstDomainById');
    }
};


const getMstDomains = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_domains(:_user_id)',
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

const updateMstDomains = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_domains(:_domain_id, :_domain_code, :_domain_name, :_active, :_user_id)',
            {
                replacements: {
                    _domain_id: model._domain_id,
                    _domain_code: model._domain_code,
                    _domain_name: model._domain_name,
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
    getMstDomainById,
    getMstDomains,
    updateMstDomains
};

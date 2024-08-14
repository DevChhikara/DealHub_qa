const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn');
const { WritetoLogFile } = require('../ErrorLog/WritetoLogFiles');
const { MstRoleParameters, MstRoleDetailParameters } = require('../../models/masters/MstRoleParameters');
const path = require('path');

const getMstRole = async (model) => {
    try {
        const result = await sequelize.query(
            'CALL sp_get_mst_roles(:_user_id)',
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

const updateMstRoles = async (model) => {
    let roleId = model._id;
    try {
        const result = await sequelize.query(
            'CALL sp_update_mst_roles(:_id, :_role_code, :_role_name, :_equivalent_cassh_role_name, :_active, :_user_id)',
            {
                replacements: {
                    _id: model._id,
                    _role_code: model._role_code,
                    _role_name: model._role_name,
                    _equivalent_cassh_role_name: model._equivalent_cassh_role_name,
                    _active: model._active,
                    _user_id: model._user_id
                },
                type: QueryTypes.SELECT
            }
        );

        const commonmessages = result.forEach(row => {
            roleId = parseInt(row.role_id);
            const mstRoleDetailParameters = new MstRoleDetailParameters({


                status: row.status,
                message: row.message,
                _role_id:roleId,
            });
            model._id = roleId;
            return mstRoleDetailParameters;
        });

        if (roleId > 0) {
            await updateMapPrivilegeRole(model);
        }

        return commonmessages;
    } catch (error) {
        writelogobfcreation(error.toString());

        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
};

const updateMapPrivilegeRole = async (model) => {
    const commonmessages = [];
    try {
        const mappedPrivileges = model._Previlege_Id.split(',');

        for (const privilegeId of mappedPrivileges) {
            const result = await sequelize.query(
                'CALL sp_update_map_privilege_role(:_Role_Id, :_Previlege_Id, :_user_id)',
                {
                    replacements: {
                        _Role_Id: model._id,
                        _Previlege_Id: parseInt(privilegeId),
                        _user_id: model._user_id
                    },
                    type: QueryTypes.SELECT
                }
            );


            const commonmessages = result.forEach(row => {
                const mstRoleDetailParameters = new MstRoleDetailParameters({
                    status: row.status,
                    message: row.message,
                });
                return mstRoleDetailParameters;
            });
        }

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
    getMstRole,
    updateMstRoles,
    updateMapPrivilegeRole
};

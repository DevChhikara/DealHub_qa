const sequelize = require('../config/dbConn');
const { DataTypes } = require('sequelize');


// Truncate migration data
async function truncateMigrationData(model) {
    try {
        const [results] = await sequelize.query('CALL sp_truncate_migrationdata(:_user_code, :_batch_no, :_TotalRecords, :_FileName, :_SupportingFileName)', {
            replacements: {
                _user_code: model._user_code,
                _batch_no: model._batch_no,
                _TotalRecords: model._TotalRecords,
                _FileName: model._FileName,
                _SupportingFileName: model._SupportingFileName
            },
            type: sequelize.QueryTypes.SELECT
        });

        // Assuming `results` is an array of tables or similar structure
        return results;
    } catch (error) {
        console.error('Error in truncateMigrationData:', error);
        throw error;
    }
}

// Update migration data
async function updateMigrationData(rds) {
    try {
        await sequelize.transaction(async (transaction) => {
            const [results] = await sequelize.query('SELECT * FROM stage_obf_migration', {
                type: sequelize.QueryTypes.SELECT,
                transaction
            });

            // Update data in batches
            await sequelize.query('CALL sp_update_data_in_batches(:data)', {
                replacements: { data: JSON.stringify(rds) },
                type: sequelize.QueryTypes.UPDATE,
                transaction
            });
        });

        return 'Data Upload Success';
    } catch (error) {
        console.error('Error in updateMigrationData:', error);
        throw error;
    }
}

// Validate migrated data
async function validateMigratedData(model) {
    let commanmessges = [];
    try {
        const [results] = await sequelize.query('CALL sp_validate_migratedData(:_user_code, :_batch_no)', {
            replacements: {
                _user_code: model._user_code,
                _batch_no: model._batch_no
            },
            type: sequelize.QueryTypes.SELECT
        });

        results.forEach(result => {
            const messageDetail = {
                status: result.status || 'Unknown',
                message: result.message || 'No message'
            };

            commanmessges.push(messageDetail);
        });

        return commanmessges;
    } catch (error) {
        console.error('Error in validateMigratedData:', error);
        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
}

// Insert migrated data
async function insertMigratedData(model) {
    let commanmessges = [];
    try {
        const [results] = await sequelize.query('CALL sp_insert_migratedData(:_user_code, :_batch_no)', {
            replacements: {
                _user_code: model._user_code,
                _batch_no: model._batch_no
            },
            type: sequelize.QueryTypes.SELECT
        });

        results.forEach(result => {
            const messageDetail = {
                status: result.status || 'Unknown',
                message: result.message || 'No message'
            };

            commanmessges.push(messageDetail);
        });

        return commanmessges;
    } catch (error) {
        console.error('Error in insertMigratedData:', error);
        return [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
    }
}

// Get migration file progress
async function getMigrationFileProgress(model) {
    try {
        const [results] = await sequelize.query('CALL sp_getmigrationfileProgress(:_user_code)', {
            replacements: {
                _user_code: model._user_code
            },
            type: sequelize.QueryTypes.SELECT
        });

        return JSON.stringify(results, null, 4);
    } catch (error) {
        console.error('Error in getMigrationFileProgress:', error);
        return 'error';
    }
}

// Get migration file errors
async function getMigrationFileErrors(model) {
    try {
        const [results] = await sequelize.query('CALL sp_getmigrationfileErrors(:_Stage_HeaderId)', {
            replacements: {
                _Stage_HeaderId: model._Stage_HeaderId
            },
            type: sequelize.QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error in getMigrationFileErrors:', error);
        throw error;
    }
}

// Get migration supporting file
async function getMigrationSupportingFile(model) {
    try {
        const [results] = await sequelize.query('CALL sp_getmigrationSupportFile(:_Stage_HeaderId)', {
            replacements: {
                _Stage_HeaderId: model._Stage_HeaderId
            },
            type: sequelize.QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error in getMigrationSupportingFile:', error);
        throw error;
    }
}

module.exports = {
    truncateMigrationData,
    updateMigrationData,
    validateMigratedData,
    insertMigratedData,
    getMigrationFileProgress,
    getMigrationFileErrors,
    getMigrationSupportingFile
};
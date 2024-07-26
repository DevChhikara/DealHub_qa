const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters');


const MstFunctionParameters = sequelize.define('MstFunctionParameters', {
    _function_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _function_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _function_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _active: {
        type: DataTypes.INTEGER, 
        allowNull: true
    }
}, {
    timestamps: false
});


MstFunctionParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstFunctionParameters
};
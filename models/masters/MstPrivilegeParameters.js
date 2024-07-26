const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters');


const MstPrivilegeParameters = sequelize.define('MstPrivilegeParameters', {
    _privilege_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _privilege_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _active: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});



MstPrivilegeParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstPrivilegeParameters
};
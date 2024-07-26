const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); // Adjust the path


const MstBranchParameters = sequelize.define('MstBranchParameters', {
    _branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _branchname: {
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

MstBranchParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstBranchParameters
};
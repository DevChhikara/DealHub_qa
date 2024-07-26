const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters');


const MstDomainParameters = sequelize.define('MstDomainParameters', {
    _domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _domain_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _domain_name: {
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


MstDomainParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstDomainParameters
};

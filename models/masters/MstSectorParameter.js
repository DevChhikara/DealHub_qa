const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 



const MstSectorParameter = sequelize.define('MstSectorParameter', {
    _Sector_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _Sector_Name: {
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



MstSectorParameter.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstSectorParameter
};
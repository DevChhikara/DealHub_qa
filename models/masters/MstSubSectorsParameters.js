const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 


const MstSubSectorsParameters = sequelize.define('MstSubSectorsParameters', {
    _SubSector_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _SubSector_Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _Sector_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});


MstSubSectorsParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstSubSectorsParameters
};
const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 
const {commanmessages} = require('../Dashboard/ObfCreationDetailsParameters');


const MstVerticalsParameters = sequelize.define('MstVerticalsParameters', {
    _vertical_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _vertical_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _vertical_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _function_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _active: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    _Sector_Id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});


MstVerticalsParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });


const MstVerticalsDetailParameters = sequelize.define('MstVerticalsDetailParameters', {
    _vertical_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});

MstVerticalsDetailParameters.belongsTo(commanmessages, { foreignKey: '_message_id' });

module.exports = {
    sequelize,
    MstVerticalsParameters,
    MstVerticalsDetailParameters
};
const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 
const {commanmessages} = require('../Dashboard/ObfCreationDetailsParameters');

const MstRoleParameters = sequelize.define('MstRoleParameters', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _role_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _role_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _equivalent_cassh_role_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _active: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _Previlege_Id: {
        type: DataTypes.STRING, 
        allowNull: true
    }
}, {
    timestamps: false
});

MstRoleParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });


const MstRoleDetailParameters = sequelize.define('MstRoleDetailParameters', {
    _role_id: {
        type: DataTypes.BIGINT, 
        allowNull: false
    }
}, {
    timestamps: false
});


MstRoleDetailParameters.belongsTo(commanmessages, { foreignKey: '_message_id' });



module.exports = {
    sequelize,
    MstRoleDetailParameters,
    commanmessges
};

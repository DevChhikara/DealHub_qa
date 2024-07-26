const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 



const MstDoaMatrixMessagesParameters = sequelize.define('MstDoaMatrixMessagesParameters', {
    _DOA_Matrix_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _Message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _MessageFor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _Prefix: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

MstDoaMatrixMessagesParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstDoaMatrixMessagesParameters
};
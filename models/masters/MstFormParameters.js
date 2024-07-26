const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); // Adjust the path


const MstFormParameters = sequelize.define('MstFormParameters', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _form_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _url: {
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


MstFormParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstFormParameters
};
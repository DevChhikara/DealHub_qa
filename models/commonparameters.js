const { Sequelize, DataTypes } = require('sequelize');


const CommonParameters = sequelize.define('CommonParameters', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Token is required' },
            notEmpty: { msg: 'Token cannot be empty' }
        }
    }
}, {
    timestamps: false,
    tableName: 'common_parameters'
});

module.exports = {
    sequelize,
    CommonParameters
};
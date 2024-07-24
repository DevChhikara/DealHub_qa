const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('AuthenticationParameters', {
        _user_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        _password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        _token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _SecretKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _attempt: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _ClientId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _CurrentPassword: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });
};

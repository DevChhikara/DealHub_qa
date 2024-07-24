const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('AuthenticationDetail', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        privilege_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ispasswordchanged: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'authentication_details'
    });
};

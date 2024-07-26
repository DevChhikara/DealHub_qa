const { Sequelize, DataTypes } = require('sequelize');

const ActiveUsers = sequelize.define('ActiveUsers', {
    user_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vertical_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    LastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = {
    sequelize,
    ActiveUsers
};

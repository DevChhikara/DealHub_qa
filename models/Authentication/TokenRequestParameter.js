const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('TokenRequestParameter', {
        _user_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });
};

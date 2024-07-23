const DataTypes = require('sequelize');
module.exports = (sequelize) => {
    // user is a table name
    return sequelize.define('UserKey', {
        ClientID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        Secretkey: {
            type: DataTypes.STRING,
            allowNull: false
        },
        StampDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false
    });
}

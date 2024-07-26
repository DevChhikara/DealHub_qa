const { Sequelize, DataTypes } = require('sequelize');

const LogApiRequestResponse = sequelize.define('LogApiRequestResponse', {
    LogId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    LogRequestURL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LogRequestData: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    LogResponseData: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ReponseStatusCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LogDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    TotalRows: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});


module.exports = {
    sequelize,
    LogApiRequestResponse
};

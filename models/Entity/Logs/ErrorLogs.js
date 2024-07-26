const { Sequelize, DataTypes } = require('sequelize');

const Errorlogs = sequelize.define('Errorlogs', {
    ErrorLogId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    Message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    SourceStackTrace: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Parameters: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ActionName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    PageName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    URL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    AppId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IpAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});



module.exports = {
    sequelize,
    Errorlogs
};

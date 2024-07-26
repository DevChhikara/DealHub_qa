const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CommonDetailsParameter = sequelize.define('CommonDetailsParameter', {
        dh_header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dh_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'CommonDetailsParameter'  // To ensure table names are unique
    });

    const ObfCreationDetailsParameters = sequelize.define('ObfCreationDetailsParameters', {
        dh_header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dh_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Result: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'ObfCreationDetailsParameters'  // To ensure table names are unique
    });

    const SaveAttachementDetailsParameters = sequelize.define('SaveAttachementDetailsParameters', {
        dh_header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dh_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'SaveAttachementDetailsParameters'  // To ensure table names are unique
    });

    const CommonMessages = sequelize.define('CommonMessages', {
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'CommonMessages'  // To ensure table names are unique
    });

    return {
        CommonDetailsParameter,
        ObfCreationDetailsParameters,
        SaveAttachementDetailsParameters,
        CommonMessages
    };
};

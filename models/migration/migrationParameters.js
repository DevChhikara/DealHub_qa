const { Sequelize, DataTypes } = require('sequelize');
// Define the MigrationParameters model
const MigrationParameters = sequelize.define('MigrationParameters', {
    _user_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _batch_no: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

// Define the TruncateMigrationDataParameters model
const TruncateMigrationDataParameters = sequelize.define('TruncateMigrationDataParameters', {
    _user_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _batch_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _TotalRecords: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _FileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _SupportingFileName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

// Define the UploadMigrationDataParameter model
const UploadMigrationDataParameter = sequelize.define('UploadMigrationDataParameter', {
    _FileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _user_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    _SupportingFileName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

// Define the GetMigrationStatusDataParameter model
const GetMigrationStatusDataParameter = sequelize.define('GetMigrationStatusDataParameter', {
    _user_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

// Define the GetMigrationFileErrorsParameter model
const GetMigrationFileErrorsParameter = sequelize.define('GetMigrationFileErrorsParameter', {
    _Stage_HeaderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    returnfilepath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = {
    sequelize,
    MigrationParameters,
    TruncateMigrationDataParameters,
    UploadMigrationDataParameter,
    GetMigrationStatusDataParameter,
    GetMigrationFileErrorsParameter
};

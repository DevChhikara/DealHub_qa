const { Sequelize, DataTypes } = require('sequelize');

const CommonParameters = sequelize.define('CommonParameters', {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

const RiskFactorGetDataParameters = sequelize.define('RiskFactorGetDataParameters', {
    _dh_header_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: CommonParameters,
            key: 'token'
        }
    }
}, {
    timestamps: false
});


const RiskFactorUpdateParameters = sequelize.define('RiskFactorUpdateParameters', {
    _dh_header_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _riskfactor_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _risklevel_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _created_by: {
        type: DataTypes.STRING,
        allowNull: true
    },
    riskfactorcomment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: CommonParameters,
            key: 'token'
        }
    }
}, {
    timestamps: false
});


module.exports = {
    sequelize,
    CommonParameters,
    RiskFactorGetDataParameters,
    RiskFactorUpdateParameters
};

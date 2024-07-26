const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define the DHSHFinalStatus model
    const DHSHFinalStatus = sequelize.define('DHSHFinalStatus', {
        dh_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        opportunity_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_loi_po_uploaded: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_revenue: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        total_cost: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        capex: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        total_margin: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        payment_terms: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        total_project_life: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ebt: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        _sf_project_primary_loc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _sf_project_brief: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    // Define the SFDataUpdation_Request model
    const SFDataUpdation_Request = sequelize.define('SFDataUpdation_Request', {}, {
        timestamps: false
    });

    // Define the CommonResponseModel model
    const CommonResponseModel = sequelize.define('CommonResponseModel', {
        Status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true
        },
        errormsg: {
            type: DataTypes.STRING,
            allowNull: true
        }
        // Uncomment if you have the warningmsg field
        // warningmsg: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // }
    }, {
        timestamps: false
    });

    // Define the SFDataUpdation_Response model
    const SFDataUpdation_Response = sequelize.define('SFDataUpdation_Response', {
        Response: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    // Define associations
    // SFDataUpdation_Request has many DHSHFinalStatus
    SFDataUpdation_Request.hasMany(DHSHFinalStatus, {
        foreignKey: 'sf_data_updation_request_id', // Adjust if necessary
        as: 'SFData'
    });

    // DHSHFinalStatus belongs to SFDataUpdation_Request
    DHSHFinalStatus.belongsTo(SFDataUpdation_Request, {
        foreignKey: 'sf_data_updation_request_id', // Adjust if necessary
        as: 'SFDataRequest'
    });

    // Export models and associations
    return {
        DHSHFinalStatus,
        SFDataUpdation_Request,
        CommonResponseModel,
        SFDataUpdation_Response
    };
};

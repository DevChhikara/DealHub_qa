const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // Define the DHSFFinalStatusData model
    const DHSFFinalStatusData = sequelize.define('DHSFFinalStatusData', {
        _param: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _userid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _oppid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        _obfid: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    // Define the DHSFFinalStatusData_Request model
    const DHSFFinalStatusData_Request = sequelize.define('DHSFFinalStatusData_Request', {
        // Uncomment and define if you have the parameter field
        // _param: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // }
    }, {
        timestamps: false
    });

    // Define the CommonResponseModelStatus model
    const CommonResponseModelStatus = sequelize.define('CommonResponseModelStatus', {
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
        irr_surplus_cash: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        irr_borrowed_fund: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        Final_Approval_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        version_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        final_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sf_record_id: {
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

    // Define the DHSFFinalStatusData_Response model
    const DHSFFinalStatusData_Response = sequelize.define('DHSFFinalStatusData_Response', {
        Response: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    // Define associations
    // DHSFFinalStatusData_Request has many DHSFFinalStatusData
    DHSFFinalStatusData_Request.hasMany(DHSFFinalStatusData, {
        foreignKey: '_param', // Adjust if necessary
        as: 'DHDataItems'
    });

    // DHSFFinalStatusData belongs to DHSFFinalStatusData_Request
    DHSFFinalStatusData.belongsTo(DHSFFinalStatusData_Request, {
        foreignKey: '_param', // Adjust if necessary
        as: 'DHSFFinalStatusRequest'
    });

    // Export models and associations
    return {
        DHSFFinalStatusData,
        DHSFFinalStatusData_Request,
        CommonResponseModelStatus,
        DHSFFinalStatusData_Response
        // Uncomment if you have the CommonResponseModelForOIC and DHStatusFromOIC_Response models
        // CommonResponseModelForOIC,
        // DHStatusFromOIC_Response
    };
};

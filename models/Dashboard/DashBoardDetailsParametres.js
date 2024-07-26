const DataTypes = require('sequelize');
module.exports = (sequelize) => {
    const DashBoardDetailsParameters = sequelize.define('DashBoardDetailsParameters', {
        dh_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        dh_header_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        dh_phase_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        phase_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Current_Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Project_Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Opp_Id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Created_On: {
            type: DataTypes.DATE,
            allowNull: false
        },
        onhold_datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Created_By: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        Total_Cost: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        Total_Revenue: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        Gross_Margin: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        mainobf: {
            type: DataTypes.STRING,
            allowNull: false
        },
        version_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currentstatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shortcurrentstatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ppl_init: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ppl_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dh_location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Vertical_Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sap_customer_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sector_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subsector_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        solutioncategory_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currentstatus_search: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_submitted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Project_Type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        progresspercentage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        IsFinalAggUpload: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_on_hold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        onholdcomment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        onhold_commentedby: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sap_io_numbers: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        sap_customer_codes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const DashBoardDetailsCountParameters = sequelize.define('DashBoardDetailsCountParameters', {
        _draft_obf: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _draft_ppl: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _draft: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _submitted_obf: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _submitted_ppl: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _submitted: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _approved_obf: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _approved_ppl: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _approved: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _rejected_obf: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _rejected_ppl: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _rejected: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _pendingobf: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _pendingppl: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _TotalPending: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        _totalapprovedppl: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        _totalapprovedobf: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const TimelineHistory = sequelize.define('TimelineHistory', {
        dh_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        dh_header_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currentstatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TimeLine: {
            type: DataTypes.STRING,
            allowNull: false
        },
        actions: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return {
        DashBoardDetailsParameters,
        DashBoardDetailsCountParameters,
        TimelineHistory
    };
};

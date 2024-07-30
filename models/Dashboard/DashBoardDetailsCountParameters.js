const DataTypes = require('sequelize');
module.exports = (sequelize) => {

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

  


return {
    DashBoardDetailsCountParameters
};
}

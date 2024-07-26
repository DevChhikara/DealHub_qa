const { Sequelize, DataTypes } = require('sequelize');

const DHData = sequelize.define('DHData', {
    obf: {
        type: DataTypes.STRING,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: true
    },
    approvalstatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assumptions_and_risks: {
        type: DataTypes.STRING,
        allowNull: true
    },
    capex: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdby: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdon: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CurrentStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    customername: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LastActionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ebt: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    grossmargin: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    irr_borrowed_fund: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    irr_surplus_cash: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    LOIPO: {
        type: DataTypes.STRING,
        allowNull: true
    },
    opportunity_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    paymenttermsindays: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    paymenttermdesc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    projectbrief: {
        type: DataTypes.STRING,
        allowNull: true
    },
    projectname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    primarylocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    projecttype: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: true
    },
    solutioncategory: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subsector: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_cost: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    total_margin: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    total_project_life: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_revenue: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    TypeofService: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vertical: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Verticalname: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

module.exports = {
    sequelize,
    DHData
};

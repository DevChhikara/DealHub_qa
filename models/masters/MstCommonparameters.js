const { Sequelize, DataTypes } = require('sequelize');

const Mstcommonparameters = sequelize.define('DHData', {
    _user_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = {
    sequelize,
    Mstcommonparameters
};

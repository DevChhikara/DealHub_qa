const { Sequelize, DataTypes } = require('sequelize');
const CommonParameters =  require('../commonparameters.js')

const MenuBindingParameter = sequelize.define('MenuBindingParameter', {
    _user_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

MenuBindingParameter.belongsTo(CommonParameters, { foreignKey: '_user_code' });

module.exports = {
    sequelize,
    MenuBindingParameter
};

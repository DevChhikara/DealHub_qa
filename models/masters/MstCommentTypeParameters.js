const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); // Adjust the path


const MstCommentTypeParameters = sequelize.define('MstCommentTypeParameters', {
    _comment_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    _comment_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});


MstCommentTypeParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });

module.exports = {
    sequelize,
    MstCommentTypeParameters
};
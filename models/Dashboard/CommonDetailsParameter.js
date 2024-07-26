const DataTypes = require('sequelize');
module.exports = (sequelize) => {
    const CommonDetailsParameter = sequelize.define('CommonDetailsParameter', {
        dh_header_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        dh_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const EntityMainParameter = sequelize.define('EntityMainParameter', {
        _dh_header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        _is_shared: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return {
        CommonDetailsParameter,
        EntityMainParameter
    };
};
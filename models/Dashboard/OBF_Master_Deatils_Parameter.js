const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Serviceslist = sequelize.define('Serviceslist', {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        viewValue: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const SolutionServices = sequelize.define('SolutionServices', {
        Solutioncategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const SolutionCategory = sequelize.define('SolutionCategory', {
        Solutioncategory: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    SolutionServices.hasMany(Serviceslist, {
        as: 'Serviceslist',
        foreignKey: 'SolutionServiceId'
    });

    SolutionCategory.hasMany(SolutionServices, {
        as: 'Solutionservices',
        foreignKey: 'SolutionCategoryId'
    });

    return {
        Serviceslist,
        SolutionServices,
        SolutionCategory
    };
};
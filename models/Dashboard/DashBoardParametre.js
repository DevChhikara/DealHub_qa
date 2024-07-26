const DataTypes = require('sequelize');
module.exports = (sequelize) => {
    const DashBoardParameters = sequelize.define('DashBoardParameters', {
        _user_code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const SystemNotificationParameters = sequelize.define('SystemNotificationParameters', {
        _dh_system_notification_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        _IsRead: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        _IsSoftDelete: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const TestForRegularExpression = sequelize.define('TestForRegularExpression', {
        testmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: /([\-a-zA-Z0-9@#$&;|,.?_()% \s\n]+)/,
                    msg: "not valid expression"
                }
            }
        }
    }, {
        timestamps: false
    });

    return {
        DashBoardParameters,
        SystemNotificationParameters,
        TestForRegularExpression
    };
};

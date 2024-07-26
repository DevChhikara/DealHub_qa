const { Sequelize, DataTypes } = require('sequelize');
const { Mstcommonparameters } = require('./MstCommonparameters'); 
const {commanmessages} = require('../Dashboard/ObfCreationDetailsParameters');



const MstUsersParameters = sequelize.define('MstUsersParameters', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    _user_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _first_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _last_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _mobile_no: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _email_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _role_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _is_cassh_user: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _active: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _islocked: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _mappedverticals: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _mappedbranches: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _encpassword: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

const MstUpdateUsersParameters = sequelize.define('MstUpdateUsersParameters', {
    _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    _is_cassh_user: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    _active: {
        type: DataTypes.STRING,
        allowNull: true
    },
    _islocked: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false
});



const MappedUserDetailParameters = sequelize.define('MappedUserDetailParameters', {
    _mapped_User_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

const MappUserBranch = sequelize.define('MappUserBranch', {
    _Branch_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

const MappUserVertical = sequelize.define('MappUserVertical', {
    _Vertical_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

const MstUserDetailParameters = sequelize.define('MstUserDetailParameters', {
    _updateduser_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    timestamps: false
});


MstUsersParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });
MstUpdateUsersParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });
MappedUserDetailParameters.belongsTo(Mstcommonparameters, { foreignKey: '_user_id' });
MstUserDetailParameters.belongsTo(commanmessages, { foreignKey: '_user_id' });
MappUserBranch.belongsTo(MappedUserDetailParameters, { foreignKey: '_mapped_User_Id' });
MappUserVertical.belongsTo(MappedUserDetailParameters, { foreignKey: '_mapped_User_Id' });


module.exports = {
    sequelize,
    MstUsersParameters,
    MstUpdateUsersParameters,
    MappedUserDetailParameters,
    MappUserBranch,
    MappUserVertical,
    MstUserDetailParameters
};
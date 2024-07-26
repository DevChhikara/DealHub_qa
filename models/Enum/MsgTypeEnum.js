const { Sequelize, DataTypes } = require('sequelize');




const MsgTypeEnum = Object.freeze({
    E: 'Error',      // E: Error
    S: 'Success',    // S: Success
    I: 'Information' // I: Information
});



const CommonErrorMessage = {
    errormessage: "something went wrong",
    datanotfound: "Data not found!",
    incorrectdata: "Input string is not in correct format"
};

const ErrorMessage = sequelize.define('ErrorMessage', {
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});


module.exports = {
    sequelize,
    MsgTypeEnum,
    CommonErrorMessage,
    ErrorMessage
};

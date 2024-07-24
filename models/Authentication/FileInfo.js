const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const FileInfo = sequelize.define('FileInfo', {
  _filename: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}, {
  timestamps: false,
});

module.exports = FileInfo;

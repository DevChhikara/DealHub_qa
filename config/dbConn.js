const config = require('./config');
var Sequelize = require('sequelize');


const opts = {
  define: {
    // prevent sequelize from pluralizing table names
    freezeTableName: true,
    timestamps: false
  },
  timezone: "+05:30",
  connectionLimit: 100
  //logging:false
}
const sequelize = new Sequelize(`mysql://${config.mysql.DB_USER}:${config.mysql.DB_PASS}@${config.mysql.DB_HOST}:${config.mysql.DB_PORT}/${config.mysql.DB_NAME}`, opts)

sequelize
  .authenticate()
  .then(() => {
    console.log('database Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to database:', err)
  })

// Models/tables

const AuthenticationParameters = require('../models/Authentication/authenticationParameters')(sequelize);

const AuthenticationDetail = require('../models/Authentication/authenticationDetailParameters')(sequelize);
module.exports = {
  sequelize,
  AuthenticationParameters,
  AuthenticationDetail,
};

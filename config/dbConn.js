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

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

// Models/tables


db.userKeyModel = require('../models/userKeyModel')(sequelize, Sequelize);
module.exports = db

const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const session = require('express-session');
const routes = require('../routes/index.route');
const passport = require("./passport");
const swaggerDocument = require('./swagger.json');


const app = express();

if (config.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';

// app.use('/', (req, res) => {
//   console.log("callllllllllllllllllllll");
// });

app.use(express.static(path.join(__dirname, distDir)));
// app.use(/^((?!(api)).)*/, (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

app.use(session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true } // Set HttpOnly attribute for the session cookie
}));


// Middleware for Authentication
app.use(passport.initialize());
app.use(passport.session());


// enable CORS - Cross Origin Resource Sharing
app.use(cors({
  origin: ['http://localhost:5050/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// API router
app.use('/', routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(path.join(__dirname, distDir)));
// catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

module.exports = app;

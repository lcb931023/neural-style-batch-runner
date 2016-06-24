// wraps winston logger
// provides logging function

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logs.log' })
  ]
});

module.exports = logger;

const fs = require('fs');
const path = require('path');

exports.writeLogToFile = (message) => {
    const logPath = path.join(__dirname, 'logs.txt');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(logPath, logMessage, (err) => {
        if (err) throw err;
    });
};
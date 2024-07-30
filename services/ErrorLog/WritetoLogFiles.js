const fs = require('fs');
const path = require('path');

class WritetoLogFile {
    constructor() {
        const now = new Date();
        this.sYear = now.getFullYear();
        this.sMonth = String(now.getMonth() + 1).padStart(2, '0');
        this.sDay = String(now.getDate()).padStart(2, '0');
        this.sHour = String(now.getHours()).padStart(2, '0');
        this.sMin = String(now.getMinutes()).padStart(2, '0');
        this.sErrorTime = `${this.sYear}${this.sMonth}${this.sDay}${this.sHour}${this.sMin}`;
    }

    logEvent(sPathName, sErrMsg, isNewPara) {
        try {
            const logFormat = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' --> ';
            const logDir = path.join(sPathName, 'ErrorLog');
            const logFile = path.join(logDir, `${this.sErrorTime}.txt`);

            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            const logMessage = logFormat + sErrMsg;

            fs.appendFileSync(logFile, (isNewPara ? '***************************************\n' : '') + logMessage + '\n');
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }
}

module.exports = WritetoLogFile;

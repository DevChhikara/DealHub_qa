const fs = require('fs');
const path = require('path');

class WritetoLogFile {
    constructor() {
        // This variable is used to create log filename format
        // for example filename: ErrorLogYYYYMMDDHHMM
        const now = new Date();
        const sYear = now.getFullYear().toString();
        const sMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const sDay = now.getDate().toString().padStart(2, '0');
        const sHour = now.getHours().toString().padStart(2, '0');
        const sMin = now.getMinutes().toString().padStart(2, '0');
        this.sErrorTime = `${sYear}${sMonth}${sDay}${sHour}${sMin}`;
    }

    logEvent(sPathName, sErrMsg, isNewPara) {
        try {
            const now = new Date();
            const sLogFormat = `${now.toISOString().replace('T', ' ').substr(0, 19)} --> `;

            const errorLogDir = path.join(sPathName, 'ErrorLog');
            if (!fs.existsSync(errorLogDir)) {
                fs.mkdirSync(errorLogDir, { recursive: true });
            }

            const logFilePath = path.join(errorLogDir, `${this.sErrorTime}.txt`);
            const logMessage = `${isNewPara ? '***************************************\n' : ''}${sLogFormat}${sErrMsg}\n`;

            // Writing the log message to the file
            fs.appendFileSync(logFilePath, logMessage);
        } catch (err) {
            console.error('Error occurred while writing to log file:', err);
        }
    }
}

module.exports = WritetoLogFile;

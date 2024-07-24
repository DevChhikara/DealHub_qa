const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const secretKey = "b14ca5898a4e4133bbce2ea2315a2021";

function encryptString(key, plainText) {
    const iv = Buffer.alloc(16, 0); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptString(key, cipherText) {
    const iv = Buffer.alloc(16, 0); 
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf8'), iv);
    let decrypted = decipher.update(cipherText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function writeLogAuthentication(message) {
    const logFilePath = path.join(__dirname, 'path/to/your/logfile.log'); // Update this path
    fs.appendFileSync(logFilePath, `${message}\n`, 'utf8');
}

function verifyRequestKey(userCode, requestKey, req) {
    const userAgent = req.headers['user-agent'];
    const browserInfo = `${req.headers['user-agent']}~${req.connection.remoteAddress}`;
    let requestBrowserInfo = '';
    let requestIPAddress = '';
    let userId = '';

    if (requestKey) {
        const originalPlainText = decryptString(secretKey, requestKey);
        const splitStrings = originalPlainText.split('^');

        if (splitStrings.length > 0) {
            userId = splitStrings[0];
            const ticks = splitStrings[1];
            const dummyGuid = splitStrings[3];

            if (splitStrings[2].length > 0) {
                const userBrowserInfo = splitStrings[2].split('~');
                if (userBrowserInfo.length > 0) {
                    requestBrowserInfo = userBrowserInfo[0];
                    requestIPAddress = userBrowserInfo[1];
                }
            }
        }
    }

    let currentUserIPAddress = req.connection.remoteAddress;

    if (req.headers['x-forwarded-for']) {
        currentUserIPAddress = req.headers['x-forwarded-for'].split(',')[0];
    }

    if (requestIPAddress !== "" && requestIPAddress !== null) {
        const currentBrowserInfo = `${req.headers['user-agent']}`;

        if (requestIPAddress !== currentUserIPAddress || currentBrowserInfo !== requestBrowserInfo || userCode.toLowerCase() !== userId.toLowerCase()) {
            writeLogAuthentication(`Antiforgery verification : IP Address: ${currentUserIPAddress}, Browser: ${currentBrowserInfo}, UserCode: ${userCode}, Antifrogerykey: ${requestKey}`);
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function requestKey(userCode, req) {
    const userAgent = req.headers['user-agent'];
    const browserInfo = `${req.headers['user-agent']}~${req.connection.remoteAddress}`;
    const sessionValue = `${userCode}^${Date.now()}^${browserInfo}^${crypto.randomUUID()}`;
    const encryptedString = encryptString(secretKey, sessionValue);
    writeLogAuthentication(`Login Antifrogery : Session value: ${sessionValue}, AntifrogeryKey: ${encryptedString}`);
    return encryptedString;
}

module.exports = {
    encryptString,
    decryptString,
    verifyRequestKey,
    requestKey
};

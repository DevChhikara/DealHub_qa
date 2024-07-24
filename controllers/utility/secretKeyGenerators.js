const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

function getSecretKey() {
    return crypto.randomBytes(48).toString('base64');
}
function getClientId() {
    return uuidv4();
}

function userSecretKey() {
    const user = 'admin';
    const password = '123456';
    const salt = Buffer.from([65, 66, 67, 68, 69, 70, 71]);
    const iterations = 49999;
    const keyLength = 16;

    const userKey = crypto.pbkdf2Sync(user, salt, iterations, keyLength, 'sha256').toString('base64');
    const passwordKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256').toString('base64');

    return `${userKey}-${passwordKey}`;
}

function createToken(userId, password) {
    const secret = "hello my name is willy wonka"
    const message = `${userId}&${password}`;
    const message2 = `${password}&${userId}`;
    const randno = crypto.randomInt(0, 2**32).toString();

    const hmac = (message) => {
        return crypto.createHmac('sha256', secret).update(message).digest('base64');
    }

    let token = hmac(message);
    token += hmac(message2);
    token += hmac(randno);
    global.StaticGlobalKey = global.StaticGlobalKey || {};
    global.StaticGlobalKey['HEADER-API-KEY'] = token;

    return token;
}

module.exports = {
    getSecretKey,
    getClientId,
    userSecretKey,
    createToken
};

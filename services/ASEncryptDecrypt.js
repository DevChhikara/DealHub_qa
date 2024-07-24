const crypto = require('crypto');

function encryptStringAES(secretkey, plainText) {
    const key = Buffer.from(secretkey, 'utf8');
    const iv = Buffer.from(secretkey, 'utf8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'binary');
    encrypted += cipher.final('binary');
    return Buffer.from(encrypted, 'binary').toString('base64');
}
function decryptStringAES(secretKey, cipherText) {
    const keyBytes = Buffer.from(secretKey, 'utf8');
    const iv = Buffer.from(secretKey, 'utf8');
    const encryptedBytes = Buffer.from(cipherText, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes, iv);
    let decrypted = decipher.update(encryptedBytes, 'binary', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

function returnMD5Hash(input) {
    const hash = crypto.createHash('md5');
    hash.update(input, 'utf8');
    const hashedString = hash.digest('hex');
    return hashedString;
}

module.exports = {decryptStringAES,returnMD5Hash,encryptStringAES};

const UserKey = require('../models/userKeyModel');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const authenticationServices = require('../services/authenticationServices')
const encryptionServices = require('../services/ASEncryptDecrypt');
const secretKeyGenerators = require('./utility/secretKeyGenerators');
const antiForgeryVerify = require('./utility/antiForgeryVerify');
const writeLogToFile = require('../models/Helpers/WriteToLogFile');

//this is may be converted into middleware in future
const validateLogin = [
    body('_user_code').notEmpty().withMessage('User code is required'),
    body('_password').notEmpty().withMessage('Password is required'),
    body('_status').notEmpty().withMessage('status is required'),
    body('_privilege_name').notEmpty().withMessage('Privilege Name is required'),
    body('_role_name').notEmpty().withMessage('status is required'),
    body('_UserName').notEmpty().withMessage('Privilege Name is required'),
    body('_ispasswordchanged').notEmpty().withMessage('ispassword is required'),

];


function verifyClientIDkey(model) {
    try {
        const skey = loginKey.find(u => u.ClientID === model._ClientId);
        if (skey) {
            const keyBytes = Buffer.from(skey.Secretkey, 'base64');
            const secretText = keyBytes.toString('utf8');
            const mainSecretkey = secretText.slice(0, -4);
            const index = loginKey.indexOf(skey);
            if (index > -1) {
                loginKey.splice(index, 1);
            }

            return mainSecretkey;
        } else {
            return '401';
        }
    } catch (error) {
        console.error('Error verifying client ID key:', error);
        return '401';
    }
}

async function verifyLogin(req, res) {

    //In Node there is no Builtin validator like (ModelState.isValid() in ASP.NET) so this block of code is added
    const errors = validateLogin(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ MsgNo: 400, MsgType: 'E', Message: 'Validation failed', Validation: errors.array() });
    }

    const model = req.body;

    //checking the body is not null
    if (!model) {
        return res.status(400).json({ MsgNo: 400, MsgType: 'E', Message: 'Object is null' });
    }
    try {


        const secretKey = verifyClientIDkey(model);
        if (secretKey === '401') {
            return res.status(401).json({ MsgNo: 401, MsgType: 'E', Message: 'Invalid client!' });
        }

        const decryptedPassword = encryptionServices.decryptStringAES(secretKey, model._password);
        const hashedPassword = encryptionServices.returnMD5Hash(decryptedPassword);
        model._password = hashedPassword;
        const decryptedUserCode = encryptionServices.decryptStringAES(secretKey, model._user_code);
        model._user_code = decryptedUserCode;
        const authDetails = await authenticationServices.authenticateUserWithAttempts(model);
        if (authDetails.length === 0 || authDetails[0].status !== 'success') {
            return res.status(401).json({
                MsgNo: 401,
                MsgType: 'E',
                Message: authDetails.length ? authDetails[0].status : 'Unknown error',
                Validation: []
            });
        }

        const auth = authDetails[0];
        const randomnum = Math.floor(Math.random() * (999999 - 110000 + 1)) + 110000;
        const keynew = `0c24f9de!b${randomnum}`;
        const key = secretKeyGenerators.createToken(auth.user_code, auth.password);

        const loginResponse = {
            user: {
                Api_Key: `${key}*$${randomnum}`,
                UC: encryptionServices.encryptStringAES(keynew, auth.user_code),
                PN: encryptionServices.encryptStringAES(keynew, auth.privilege_name),
                RN: encryptionServices.encryptStringAES(keynew, auth.role_name),
                UN: auth.UserName,
                UI: encryptionServices.encryptStringAES(keynew, auth.user_id.toString()),
                ispasswordchanged: auth.ispasswordchanged,
                AntiforgeryKey: antiForgeryVerify.requestKey(auth.user_code)
            }
        };

        await authenticationServices.updateToken(model);

        return res.status(200).json(loginResponse);
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        return res.status(500).json({ MsgNo: 500, MsgType: 'E', Message: 'Internal server error' });
    }
}

async function getClientKey(req, res) {
    try {

        await UserKey.destroy({
            where: {
                StampDate: {
                    [Op.lt]: new Date(Date.now() - 5 * 60000)
                }
            }
        });


        const randomNumber = Math.floor(1000 + Math.random() * 9000 * 1);
        const randomNumber2 = Math.floor(1000 + Math.random() * 9000);
        const key = crypto.randomUUID().replace(/-/g, '!').substring(0, 12) + randomNumber.toString() + randomNumber2.toString();
        const currentSecretKey = Buffer.from(key).toString('base64');

        const userKey = await UserKey.create({
            ClientID: crypto.randomUUID(),
            Secretkey: currentSecretKey,
            StampDate: new Date()
        });

        writeLogToFile(`userKey  ${JSON.stringify(userKey)}`);
        res.status(200).json(userKey);
    } catch (error) {
        writeLogToFile(`Exception in clientKey:  ${error.toString()}`);
        res.status(400).json({ message: error.message });
    }
};



module.exports = {
    verifyLogin,
    getClientKey
};
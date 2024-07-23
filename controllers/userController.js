const UserKey = require('../models/userKeyModel');
const crypto = require('crypto');
const { Op } = require('sequelize');

exports.getClientKey = async (req, res) => {
    try {
        // Remove keys older than 5 minutes
        await UserKey.destroy({
            where: {
                StampDate: {
                    [Op.lt]: new Date(Date.now() - 5 * 60000)
                }
            }
        });

        // Generate random key
        const randomNumber = Math.floor(1000 + Math.random() * 9000 * 1);
        const randomNumber2 = Math.floor(1000 + Math.random() * 9000);
        const key = crypto.randomUUID().replace(/-/g, '!').substring(0, 12) + randomNumber.toString() + randomNumber2.toString();
        const currentSecretKey = Buffer.from(key).toString('base64');

        const userKey = await UserKey.create({
            ClientID: crypto.randomUUID(),
            Secretkey: currentSecretKey,
            StampDate: new Date()
        });

        ErrorService.writeLogToFile(`userKey  ${JSON.stringify(userKey)}`);
        res.status(200).json(userKey);
    } catch (error) {
        ErrorService.writeLogToFile(`Exception in clientKey:  ${error.toString()}`);
        res.status(400).json({ message: error.message });
    }
};




const { DataTypes } = require('sequelize');
const nodemailer = require('nodemailer');
const config = require('config');
const WritetoLogFile = require('../../models/Helpers/WriteToLogFile');

module.exports = (sequelize) => {
    const EmailSendingProperties = sequelize.define('EmailSendingProperties', {
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const EmailToCCParameters = sequelize.define('EmailToCCParameters', {
        email_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const EmailAttachmentParameters = sequelize.define('EmailAttachmentParameters', {
        file_path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    const ShareEmailParameters = sequelize.define('ShareEmailParameters', {
        _dh_header_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        _user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        _ToEmailId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return {
        EmailSendingProperties,
        EmailToCCParameters,
        EmailAttachmentParameters,
        ShareEmailParameters
    };
};

// EmailSender class in JavaScript
class EmailSender {
    constructor() {
        this.fromEmail = config.get('FromEmail');
        this.targetName = config.get('Targetname');
        this.emailPassword = config.get('EmailPassword');
        this.portNo = parseInt(config.get('port'));
        this.hostName = config.get('hostname');
        this.useCredentials = config.get('usecreditionals');
        this.enableSsl = config.get('enablessl');
        this.isBodyHtml = config.get('IsBodyHtml');
    }

    async sendEmail(emailProps) {
        try {
            this.writeEmailSenderLog(`From email : ${this.fromEmail}`);

            const mailOptions = {
                from: this.fromEmail,
                to: emailProps.SendTo.map(to => to.email_id),
                cc: emailProps.SendCC.map(cc => cc.email_id),
                subject: emailProps.subject,
                html: emailProps.body,
                attachments: emailProps.Attachment.map(att => ({ path: att.file_path }))
            };

            if (this.isBodyHtml === "N") {
                mailOptions.html = false;
            }

            const transporter = nodemailer.createTransport({
                host: this.hostName,
                port: this.portNo,
                secure: this.enableSsl === "Y",
                auth: this.useCredentials === "Y" ? {
                    user: this.fromEmail,
                    pass: this.emailPassword
                } : null
            });

            this.writeEmailSenderLog(`Host name : ${this.hostName}`);
            this.writeEmailSenderLog(`portno : ${this.portNo}`);
            this.writeEmailSenderLog(`From Email : ${this.fromEmail}`);
            this.writeEmailSenderLog(`Email Password : ${this.emailPassword}`);
            this.writeEmailSenderLog(`enablessl : ${this.enableSsl}`);
            this.writeEmailSenderLog(`enablessl  ==== ${this.enableSsl}`);

            await transporter.sendMail(mailOptions);
        } catch (error) {
            this.writeEmailSenderLog(`Error occurred while sending email : ${error}`);
            throw error;
        }
    }

    writeEmailSenderLog(errorDetails) {
        const logFilePath = config.get('logfilepath');
        const logWriter = new WritetoLogFile();
        logWriter.LogEvent(logFilePath, errorDetails, true);
    }
}

module.exports.EmailSender = EmailSender;

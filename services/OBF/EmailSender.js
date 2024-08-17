const { QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConn'); // Path to your Sequelize setup
const nodemailer = require('nodemailer');
const { getEncryptedData, writeLogOBFcreation } = require('./utils'); // Assumed utility functions
const path = require('path');
const fs = require('fs');
/* const { sendEmail } = require(); 
const { getTableData } = require(); */
/* const { logEvent } = require(); */


class EmailSendModelUserCreation {
    constructor(userCode, encPassword) {
        this._user_code = userCode;
        this._encpassword = encPassword;
    }
}

async function Email_Sending_Details(filter) {
    const responseMessages = [];

    try {
        // Execute stored procedure
        const [results] = await sequelize.query('CALL sp_getEmail_Sending_Details_Actionwise(:dhheaderid, :user_id, :isapproved, :is_on_hold)', {
            replacements: {
                dhheaderid: filter._dh_header_id,
                user_id: filter._created_by,
                isapproved: filter.isapproved,
                is_on_hold: filter.is_on_hold
            },
            type: QueryTypes.SELECT
        });

        // Separate results into different tables
        const replaceEmailContent = results.filter(row => row.tableName === 'replaceemailcontent');
        const emailBody = results.filter(row => row.tableName === 'EmailBody');
        const toEmail = results.filter(row => row.tableName === 'ToEmail');
        const ccEmail = results.filter(row => row.tableName === 'CCEmail');
        const pplInitToEmail = results.filter(row => row.tableName === 'PPLInit_ToEmail');
        const pplInitEmailBody = results.filter(row => row.tableName === 'PPLInit_EmailBody');

        if (replaceEmailContent.length > 0) {
            let link = 'YourAppLink'; // Replace with your actual link
            let containsLink = false;
            let dh_id = '';
            let dh_header_id = '';

            if (replaceEmailContent[0].linkforemail) {
                containsLink = true;
                const encryptionKey = getEncryptedData();
                dh_id = `$!$030!m0l0l${encryptionKey}*$${replaceEmailContent[0].dh_id}`;
                dh_header_id = `$!$030!m0l0l${encryptionKey}*$${replaceEmailContent[0].dh_header_id}`;
                link = `${link}${dh_id}/${dh_header_id}/fromemail`;
            }

            // Prepare email sending properties
            const emailOptions = {
                from: 'your-email@example.com', // Replace with your email
                to: [],
                cc: [],
                subject: '',
                text: ''
            };

            // Process email body
            emailBody.forEach(row => {
                let email_subject = row.email_subject;
                let email_body = row.email_body;

                replaceEmailContent.forEach(replaceRow => {
                    if (containsLink) {
                        email_body = email_body.replace('#linkforemail', link);
                    }
                    Object.keys(replaceRow).forEach(columnName => {
                        email_subject = email_subject.replace(`#${columnName}`, replaceRow[columnName]);
                        email_body = email_body.replace(`#${columnName}`, replaceRow[columnName]);
                    });
                });

                emailOptions.subject = email_subject;
                emailOptions.text = email_body;
            });

            // Add To and CC email addresses
            toEmail.forEach(row => emailOptions.to.push(row.ToEmailId));
            ccEmail.forEach(row => emailOptions.cc.push(row.CcEmailId));

            // Send the email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@example.com', // Replace with your email
                    pass: 'your-email-password' // Replace with your email password
                }
            });

            await transporter.sendMail(emailOptions);

            responseMessages.push({ message: 'Email sent successfully', status: 'success' });
        } else {
            responseMessages.push({ message: 'Failure in sending mail', status: 'failure' });
        }

        // Handle PPLInit emails if needed
        if (pplInitToEmail.length > 0) {
            const pplInitOptions = {
                from: 'your-email@example.com',
                to: [],
                cc: [],
                subject: '',
                text: ''
            };

            pplInitEmailBody.forEach(row => {
                let email_subject = row.email_subject;
                let email_body = row.email_body;

                replaceEmailContent.forEach(replaceRow => {
                    Object.keys(replaceRow).forEach(columnName => {
                        email_subject = email_subject.replace(`#${columnName}`, replaceRow[columnName]);
                        email_body = email_body.replace(`#${columnName}`, replaceRow[columnName]);
                    });
                });

                pplInitOptions.subject = email_subject;
                pplInitOptions.text = email_body;
            });

            pplInitToEmail.forEach(row => pplInitOptions.to.push(row.ToEmailId));

            await transporter.sendMail(pplInitOptions);
        }

    } catch (error) {
        const errorDetails = `Error in Email_Sending_Details: ${error.message}`;
        writeLogOBFcreation(errorDetails);
        responseMessages.push({ message: 'Error occurred', status: 'error' });
    }

    return responseMessages;
}

//// 

function getEncryptedData() {
    try {
        const min = 1000;
        const max = 9999;
        const randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomnumber.toString();
    } catch (error) {
        console.error('Error in getEncryptedData:', error);
        throw error; // Re-throw the error for higher-level handling
    }
}

//// 

async function shareEmail(model) {
    const _commanmessges = [];
    try {
        // Execute stored procedure and get the data
        const ds = await getTableData('sp_getshareobfdetails', {
            _dh_header_id: model._dh_header_id,
            _user_id: model._user_id
        });

        if (ds && ds.replaceemailcontent) {
            let ep = {
                SendTo: [],
                SendCC: [],
                Attachment: []
            };

            if (ds.EmailBody) {
                ds.EmailBody.forEach((row) => {
                    let email_subject = row.email_subject;
                    let email_body = row.email_body;

                    ds.replaceemailcontent.forEach((replaceRow) => {
                        Object.keys(replaceRow).forEach((key) => {
                            email_subject = email_subject.replace(`#${key}`, replaceRow[key]);
                            email_body = email_body.replace(`#${key}`, replaceRow[key]);
                        });
                    });

                    ep.subject = email_subject;
                    ep.body = email_body;
                });

                // Process ToEmailIds
                const toEmailIds = model._ToEmailId.split(',');
                toEmailIds.forEach((email) => {
                    ep.SendTo.push({ email_id: email });
                });

                // Process CCEmails
                if (ds.CCEmail) {
                    ds.CCEmail.forEach((row) => {
                        ep.SendCC.push({ email_id: row.CcEmailId });
                    });
                }

                // Process Attachments
                if (ds.AttachmentDetails) {
                    ds.AttachmentDetails.forEach((row) => {
                        const filepath = path.resolve(row.filepath);
                        if (fs.existsSync(filepath)) {
                            ep.Attachment.push({ file_path: filepath });
                        }
                    });
                }

                // Send the email
                await sendEmail(ep);

                _commanmessges.push({
                    message: 'Success in sharing Email',
                    status: 'Success'
                });
            } else {
                _commanmessges.push({
                    message: 'Failure in sharing Email',
                    status: 'failure'
                });
            }
        } else {
            _commanmessges.push({
                message: 'Failure in sharing Email',
                status: 'failure'
            });
        }
    } catch (error) {
        console.error('Error in shareEmail:', error);
        _commanmessges.push({
            message: 'Failure in sharing Email',
            status: 'failure'
        });
    }

    return _commanmessges;
}

//// 
async function userCreationMail(model) {
    const _commanmessges = [];

    try {
        // Execute stored procedure and get the data
        const ds = await getTableData('sp_getemaildetails_usercreation', {
            _encpassword: model._encpassword,
            _user_id: model._user_code
        });

        if (ds && ds.replaceemailcontent) {
            const ep = {
                SendTo: [],
                SendCC: [],
                Attachment: []
            };

            if (ds.EmailBody) {
                logEvent('Inside email body');
                ds.EmailBody.forEach((row) => {
                    logEvent(`Email subject data ==== ${row.email_subject}`);

                    let link = process.env.AppLinklOGIN; // Assuming environment variable
                    logEvent(`Link ======= ${link}`);

                    if (ds.replaceemailcontent.some(col => col.linkforemail !== undefined)) {
                        logEvent('Setting link value');
                        row.linkforemail = link;
                    }

                    let email_subject = row.email_subject;
                    let email_body = row.email_body;
                    logEvent(`Email body ==== ${email_body}`);

                    ds.replaceemailcontent.forEach((replaceRow) => {
                        Object.keys(replaceRow).forEach((key) => {
                            email_subject = email_subject.replace(`#${key}`, replaceRow[key]);
                            email_body = email_body.replace(`#${key}`, replaceRow[key]);
                        });
                    });

                    logEvent(`Setting subject and body to ep`);
                    ep.subject = email_subject;
                    ep.body = email_body;
                });

                if (ds.ToEmail) {
                    logEvent(`To email value ======= ${JSON.stringify(ds.ToEmail)}`);
                    ds.ToEmail.forEach((toRow) => {
                        ep.SendTo.push({ email_id: toRow.ToEmailId });
                    });
                }

                logEvent(`To email ids ===== ${JSON.stringify(ep.SendTo)}`);

                if (ds.CCEmail) {
                    ds.CCEmail.forEach((ccRow) => {
                        ep.SendCC.push({ email_id: ccRow.CcEmailId });
                    });
                }

                logEvent(`CC email ids : ${JSON.stringify(ep.SendCC)}`);

                if (ds.AttachmentDetails) {
                    ds.AttachmentDetails.forEach((row) => {
                        const filepath = path.resolve(row.filepath);
                        logEvent(`File path ::: ${filepath}`);
                        if (fs.existsSync(filepath)) {
                            logEvent(`File exists with file path : ${filepath}`);
                            ep.Attachment.push({ file_path: filepath });
                        }
                    });
                }

                await sendEmail(ep);

                _commanmessges.push({
                    message: 'Success in sharing Email',
                    status: 'Success'
                });
            } else {
                _commanmessges.push({
                    message: 'Failure in sharing Email',
                    status: 'failure'
                });
            }
        } else {
            _commanmessges.push({
                message: 'Failure in sharing Email',
                status: 'failure'
            });
        }
    } catch (error) {
        logEvent(`Exception in email sender dal === ${error}`);
        throw error;
    }

    logEvent(`Common messages ::: ${JSON.stringify(_commanmessges)}`);
    return _commanmessges;
}

///// 
async function getSystemNotification(userCode) {
    try {
        // Define a model for the results of the stored procedure
        const SystemNotification = sequelize.define('SystemNotification', {}, { tableName: 'system_notification', timestamps: false });

        // Execute the stored procedure
        const [results, metadata] = await sequelize.query('CALL sp_get_system_notification(:userCode)', {
            replacements: { userCode },
            type: Sequelize.QueryTypes.SELECT
        });

        // Convert the results to a JSON string with indentation
        return JSON.stringify(results, null, 4);

    } catch (error) {
        console.error('Error in getSystemNotification:', error);
        throw error;
    }
}
////// 

async function updateSystemNotification(filters) {
    let commanmessges = [];

    try {
        for (const filter of filters) {
            const [results] = await sequelize.query('CALL sp_update_system_notification(:_dh_system_notification_id, :_IsRead, :_IsSoftDelete)', {
                replacements: {
                    _dh_system_notification_id: filter._dh_system_notification_id,
                    _IsRead: filter._IsRead,
                    _IsSoftDelete: filter._IsSoftDelete
                },
                type: sequelize.QueryTypes.SELECT
            });

            for (const result of results) {
                const messageDetail = {
                    status: result.status || 'Unknown',
                    message: result.message || 'No message'
                };

                commanmessges.push(messageDetail);
            }
        }
    } catch (error) {
        commanmessges = [{
            status: 'Failed',
            message: 'Error in saving parameters'
        }];
        console.error('Error in Update_System_Notification:', error);
    }

    return commanmessges;
}

module.exports = {
    Email_Sending_Details,
    getEncryptedData,
    shareEmail,
    userCreationMail,
    EmailSendModelUserCreation,
    getSystemNotification,
    updateSystemNotification,
};

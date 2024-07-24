const crypto = require('crypto');
const config = require('../config/config');
const writeLogToFile = require('../services/errorService');


async function authenticateUserWithAttempts(filter) {
    const authuser = [];
    const connectionString = {
        host: config.mysql.DB_HOST,
        user: config.mysql.DB_USER,
        password: config.mysql.DB_PASS,
        database: config.mysql.DB_NAME
    };
    try {
        filter._user_code = filter._user_code.toLowerCase();
        let attempts = parseInt(filter._attempt);

        const connection = await mysql.createConnection(connectionString);
        try {
            const [rows] = await connection.execute(
                "SELECT id, LoginAttempt FROM mst_users WHERE user_code = ? OR email_id = ?",
                [filter._user_code, filter._user_code]
            );

            if (rows.length > 0) {
                writeLogToFile("Ds data found");
                attempts = rows[0].LoginAttempt;

                if (attempts === 3) {
                    const status = "Your Account Already Locked";
                    authuser.push({ status });
                } else {
                    writeLogToFile("Max attempts not reached");
                    const [result] = await connection.query(
                        "CALL sp_auth_user_attempt(?, ?)",
                        [filter._user_code, filter._password]
                    );

                    if (result[0].length > 0 && result[0][0].LoginAttempt !== "") {
                        writeLogToFile("Login attempt found");
                        filter._attempt = result[0][0].LoginAttempt;
                        writeLogToFile("Attempts value: " + filter._attempt);

                        if (parseInt(filter._attempt) !== 3) {
                            const status = result[0][0].status;
                            writeLogToFile("Status value: " + status);

                            if (status !== "success") {
                                authuser.push({
                                    user_code: "",
                                    status
                                });
                            } else {
                                writeLogToFile("Updating mst_users login details");
                                await connection.execute(
                                    `SET SQL_SAFE_UPDATES = 0;
                                    UPDATE mst_users SET LoginAttempt = 0, LastLoginDate = SYSDATE()
                                    WHERE (user_code = ? OR email_id = ?) AND password = ?;
                                    SET SQL_SAFE_UPDATES = 1;`,
                                    [filter._user_code, filter._user_code, filter._password]
                                );

                                authuser.push({
                                    user_id: result[0][0].id,
                                    user_code: result[0][0].user_code,
                                    password: result[0][0].password,
                                    privilege_name: result[0][0].privilege_name,
                                    role_name: result[0][0].role_name,
                                    UserName: result[0][0].user_name,
                                    ispasswordchanged: result[0][0].ispasswordchanged,
                                    status: status
                                });
                            }
                        } else {
                            const status = "Your Account Already Locked...Contact Administrator";
                            authuser.push({ status });
                        }
                    } else {
                        let status = "Your Email ID or Password is wrong";
                        let strquery = "";
                        if (attempts > 2) {
                            strquery = `
                                SET SQL_SAFE_UPDATES = 0;
                                UPDATE mst_users SET islocked = 1, LoginAttempt = ? 
                                WHERE (user_code = ? OR email_id = ?) AND password = ?;
                                SET SQL_SAFE_UPDATES = 1;
                            `;
                            status = "You Reached Maximum Attempts. Your account has been locked";
                        } else {
                            attempts += 1;
                            filter._attempt = attempts.toString();
                            if (attempts === 3) {
                                strquery = `
                                    SET SQL_SAFE_UPDATES = 0;
                                    UPDATE mst_users SET islocked = 1, LoginAttempt = ? 
                                    WHERE user_code = ? OR email_id = ?;
                                    SET SQL_SAFE_UPDATES = 1;
                                `;
                                status = "Your Account Locked";
                            } else {
                                strquery = `
                                    SET SQL_SAFE_UPDATES = 0;
                                    UPDATE mst_users SET LoginAttempt = ? 
                                    WHERE user_code = ? OR email_id = ?;
                                    SET SQL_SAFE_UPDATES = 1;
                                `;
                                status = "Your Email ID or Password is wrong";
                            }
                        }

                        await connection.execute(strquery, [attempts, filter._user_code, filter._user_code, filter._password]);
                        authuser.push({ status });
                    }
                }
            } else {
                const status = "Your Email ID or Password is wrong";
                authuser.push({ status });
            }
        } finally {
            await connection.end();
        }

        return authuser;
    } catch (e) {
        const errordetails = `error in authenticate user with attempts at ${new Date().toISOString()}\n${e.toString()}`;
        writeLogToFile(errordetails);

        const status = "something went wrong";
        authuser.push({ status });
        return authuser;
    }
}

async function deleteToken(usercode) {
    const deleteResult = { result: 'Failure' };
    const connection = mysql.createConnection({
        host: config.mysql.DB_HOST,
        user: config.mysql.DB_USER,
        password: config.mysql.DB_PASS,
        database: config.mysql.DB_NAME
    });

    try {
        connection.connect();
        const query = `
            SET SQL_SAFE_UPDATES = 0;
            UPDATE mst_users SET token = '' WHERE user_code = ?;
            SET SQL_SAFE_UPDATES = 1;
        `;

        const [result] = await connection.promise().query(query, [usercode]);

        if (result.affectedRows > 0) {
            deleteResult.result = 'Success';
        }

    } catch (error) {
        const errordetails = `Error in deleteToken at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogToFile(errordetails);
    } finally {
        connection.end();
    }
    return deleteResult;
}


async function updateToken(model){
    const connectionConfig = mysql.createConnection({
        host: config.mysql.DB_HOST,
        user: config.mysql.DB_USER,
        password: config.mysql.DB_PASS,
        database: config.mysql.DB_NAME
    });

    let connection;

    try {
        connection = await mysql.createConnection(connectionConfig);

        const query = `CALL sp_save_token(?, ?)`;
        const [result] = await connection.query(query, [model._user_code, model._token]);

        return result.affectedRows;

    } catch (error) {
        const errordetails = `Error in updateToken at ${new Date().toISOString()}\n${error.toString()}`;
        writeLogToFile(errordetails);
        return -1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }

}

module.exports = {authenticateUserWithAttempts,deleteToken,updateToken};

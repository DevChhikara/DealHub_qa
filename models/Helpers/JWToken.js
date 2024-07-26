class JWToken {
    constructor(access_token, token_type, expires_in, status) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = expires_in;
        this.status = status;
    }
}

module.exports = JWToken;
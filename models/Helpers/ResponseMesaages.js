class ResponseMessage {
    constructor(MsgNo = '', MsgType = '', Message = '', Validation = null) {
        this.Record = {};
        this.Record["MSG_SNO"] = MsgNo;
        this.Record["MSG_TYP"] = MsgType;
        this.Record["MESSAGE"] = Message;
        if (Validation !== null) {
            this.Record["Validation"] = Validation;
        }
    }
}

class ResponseMessageCollection {
    constructor() {
        this.Records = [];
    }

    addMessage(responseMessage) {
        if (responseMessage instanceof ResponseMessage) {
            this.Records.push(responseMessage);
        } else {
            throw new Error('Only instances of ResponseMessage can be added.');
        }
    }
}

module.exports = {
    ResponseMessage,
    ResponseMessageCollection
};

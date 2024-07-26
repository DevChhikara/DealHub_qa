// File: validators/validationAttributes.js

const { check, validationResult } = require('express-validator');

// Custom MaxLengthTrim Validation
function maxLengthTrim(length) {
    return check('*')
        .custom(value => {
            if (value !== undefined && value !== null) {
                const trimmedValue = value.toString().trim();
                if (trimmedValue.length > length) {
                    throw new Error(`The field must be a string with a maximum length of ${length}.`);
                }
            }
            return true;
        });
}

// Custom IntNull Validation
function intNull() {
    return check('*')
        .custom(value => {
            if (value !== null && value !== 0) {
                throw new Error('The integer value must be null or 0.');
            }
            return true;
        });
}

// Middleware for validating request
const validateRequest = [
    maxLengthTrim(100),  // Example length
    intNull(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    maxLengthTrim,
    intNull,
    validateRequest
};

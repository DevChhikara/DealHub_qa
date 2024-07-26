/**
 * Recursively trims all string properties of an object.
 * @param {Object} obj - The object whose string properties are to be trimmed.
 */
function trimAllStrings(obj) {
    if (obj === null || obj === undefined) return;

    Object.keys(obj).forEach(key => {
        const value = obj[key];

        if (typeof value === 'string') {
            obj[key] = value.trim();
        } else if (typeof value === 'object' && value !== null) {
            // Recursively trim strings in nested objects
            trimAllStrings(value);
        }
    });
}

module.exports = trimAllStrings;
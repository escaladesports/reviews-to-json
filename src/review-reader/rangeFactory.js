// public
module.exports = {
    /**
     * Creates a range for Google Sheets spreadsheets based on given options
     * @param {String} sheetName
     * @param {Object} [options] Options object
     * @param {Number} [options.skip=0] Optional number of rows to skip at the beginning of range (useful for skipping headers, etc.)
     * @param {Number} [options.length=null] Optional page length/record limit (falsy value = fetch all)
     * @param {Number} [options.page=1] Optional page number
     * @returns {String} Google Sheets range string
     */
    createRecordRange: function(sheetName, dataStoreConfig, options) {
        if (!sheetName || typeof sheetName !== 'string') {
            throw new Error('rangeFactory.createRecordRange requires a sheetName string as its first parameter');
        }

        const forceOptions = options || {};
        const skip = forceOptions.skip || 0; // initial rows to skip, as defined by schema
        const length = forceOptions.length || null;
        const page = forceOptions.page || 1;
        const schema = dataStoreConfig.schema;
        const startColumn = schema[0].col; // first column, defined by schema
        const endColumn = schema[schema.length-1].col; // final column, defined by schema

        let startRow = 1 + (skip || 0),
            endRow = null,
            range = '';

        if (length && length > 0 && page && page > 0) { // calc # of rows to skip based on pagination
            startRow += length*(page-1);
            endRow = startRow + length - 1;
        }

        range += sheetName + '!' + startColumn + startRow + ':' + endColumn; // ex: Sheet1!A3:E

        if (endRow) {
            range += endRow; // ex Sheet1!A3:E13
        }

        return range;
    }
};

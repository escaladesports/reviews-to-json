// dependencies
const google = require('googleapis');
const Promise = require('bluebird');
const config = require('config');
const rangeFactory = require('./rangeFactory.js');
const ReviewModel = require('./ReviewModel.js');


// private
function readData(auth, options) {
    const sheets = google.sheets('v4');
    const range = rangeFactory.createRecordRange(config.get('datastore.sheetName'), {
        skip: config.get('datastore.rowSkip'),
        page: options.page,
        length: options.length
    });
    const spreadsheetId = config.get('datastore.spreadsheetId');
    const getAsync = Promise.promisify(sheets.spreadsheets.values.get);

    return getAsync({
        auth: auth,
        spreadsheetId: spreadsheetId,
        range: range,
    }).then(response => {
        return parseReviews(response.values) || [];
    }).catch(err => {
        console.error('The Google Sheets API returned an error: '+err);
        return err;
    });
}

function parseReviews(reviews) {
    const schema = config.get('datastore.schema');
    const reviewModels = [];
    for (var i=0; i<reviews.length; i++) {
        reviewModels.push(new ReviewModel(reviews[i], schema));
    }
    return reviewModels;
}


// public
module.exports = {
    /**
     * Fetches all review records from spreadsheet, with optional pagination/length limits
     * @param {google.auth.OAuth2} auth Oauth2 client with valid credentials
     * @param {Object} options Options object
     * @param {Number} options.page Page number to fetch
     * @param {Number} options.length Page length/fetch row limit
     * @returns {Promise.<Array.<ReviewModel>>} Promise that resolves to an array of reviews
     * @example
     * // returns a promise resolving to an array of all reviews
     * return reviewReader.read(oauth2Client);
     * @example
     * // returns a promise resolving to an array of the first 20 reviews
     * return reviewReader.read(oauth2Client, {length: 20});
     * @example
     * // returns a promise resolving to an array of reviews 21-40 (page 2, page length 20)
     * return reviewReader.read(oauth2Client, {length: 20, page: 2});
     */
    read: function(auth, options) {
        const opt = options || {};
        const setupOptions = { // read all reviews by default
            page: opt.page || 1,
            length: opt.length || null
        };
        return readData(auth, setupOptions);
    }
};

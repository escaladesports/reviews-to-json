// dependencies
require('dotenv').config();
const google = require('googleapis');

// credential information
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Create a JWT client with the given credentials, and then execute the given callback function
 * @protected
 * @param {Object} credentials Authorization client credentials
 */
function authorizeJWT(credentials) {
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES,
        null
    );

    return auth;
}

/**
    Load and prepare credentials for auth (currently uses environment variables)
    Nothing actually async going on immediately but this uses promises anyway to keep the flow promise-based
    in case anything changes later
    @protected
    @returns {Promise.<Object>} Credentials object ready to pass to a new google JWT
*/
function prepareCredentials() {
    const credentials = {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
    return Promise.resolve(credentials);
}

// public
module.exports = {
    /**
     * Load client secrets from a local file (or sets up credentials, if they do not exist)
     * @returns {Promise.<Object|Error>} Returns a promise that resolves to the auth client or rejects to an error
     */
    auth: function() {
        return prepareCredentials().then(credentials => {
            return authorizeJWT(credentials);
        })
        .catch(err => {
            console.error('Error loading client secret file: '+err);
            throw err; // application cannot continue without valid credentials
        });
    }
}

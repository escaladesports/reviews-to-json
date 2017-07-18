// dependencies
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const Promise = require('bluebird');
const config = require('config');

// create promise-using versions of async functions
Promise.promisifyAll(fs);

// credential information
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_DIR = config.get('auth.tokenDir');
const TOKEN_PATH = TOKEN_DIR + config.get('auth.tokenFile');


// private

/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function
 * @protected
 * @param {Object} credentials Authorization client credentials
 */
function authorizeOauth2(credentials) {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const auth = new googleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    return fs.readFileAsync(TOKEN_PATH).then(token => {
        oauth2Client.credentials = JSON.parse(token);
        return oauth2Client;
    }).catch(err => {
        console.error('Error while trying to read token file '+TOKEN_PATH+': '+err);
        return getNewToken(oauth2Client);
    });
}

/**
 * Get and store new token (to a local file in ~/.credentials) after prompting user for authorization
 * @protected
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get a token for
 * @returns {Promise.<google.auth.OAuth2|Error> Returns a promise that resolves to a {@link google.auth.OAuth2|OAuth2 client} or rejects to an error
 */
function getNewToken(oauth2Client) {
    let token;

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const getTokenAsync = Promise.promisify(oauth2Client.getToken, {context: oauth2Client});

    console.log('Authorize this app by visiting this URL: '+authUrl);

    return new Promise((resolve, reject) => { // readline.question()'s function signature doesn't work for automatic promisification
        rl.question('Enter the code from that page here: ', code => {
            rl.close();
            getTokenAsync(code).then(getToken => {
                token = getToken;
                oauth2Client.credentials = token;
                resolve(oauth2Client);
            }).catch(err => {
                console.error('Error while trying to retrieve access token: '+err);
                reject(err);
            });
        });
    }).then(authClient => {
        return storeToken(token);
    });
}


/**
 * Store token to disk to be used in later program executions
 * @protected
 * @param {Object} token The token to store to disk
 * @returns {Promise.<Object|Error>} Returns a promise that resolves to the token object or rejects to an error
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    }
    catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    console.log('Writing token to file '+TOKEN_PATH);
    console.dir(token);
    return fs.writeFileAsync(TOKEN_PATH, JSON.stringify(token)).then(() => {
        console.log('Token stored to '+TOKEN_PATH);
        return token;
    }).catch(err => {
        console.error('Error storing token to '+TOKEN_PATH+': '+err);
        return err;
    });
}

/**
 * Create a JWT client with the given credentials, and then execute the given callback function
 * @protected
 * @param {Object} credentials Authorization client credentials
 */
function authorizeJWT(credentials) {
    console.log('credentials: ');
    console.dir(credentials);
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES,
        null
    );

    return auth;
}

// public
module.exports = {
    /**
     * Load client secrets from a local file (or sets up credentials, if they do not exist)
     * @returns {Promise.<Object|Error>} Returns a promise that resolves to the auth client or rejects to an error
     */
    auth: function() {
        return fs.readFileAsync('client_secret.json').then(content => {
            return authorizeJWT(JSON.parse(content));
        })
        .catch(err => {
            console.error('Error loading client secret file: '+err);
            throw err; // application cannot continue without valid credentials
        });
    }
}

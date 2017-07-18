// dependencies
const auth = require('./auth.js');
const reviewReader = require('./spreadsheetReader.js');
const ReviewModelFilter = require('./ReviewModelFilter.js');
const PaginationFilter = require('./PaginationFilter.js');


// utility functions

/**
 * Filters out reviews based on specified options
 * @protected
 * @param {Object} opts Config object
 * @param {string} opts.approved Indicates whether to show only approved reviews ('true' = approved only 'false' = unapproved undefined = all)
 * @param {Array.<ReviewModel>} reviews
 * @returns {Array.<ReviewModel>} Filtered array of matching ReviewModels
 */
function filterApproved(opts, reviews) {
    // filter reviews on approval status, if specified
    const filterOpts = {};
    if (opts.approved === 'true') {
        filterOpts.reviewApproved = 'TRUE';
    }
    else if (opts.approved === 'false') {
        filterOpts.reviewApproved = 'FALSE';
    }
    return (new ReviewModelFilter(filterOpts).filter(reviews));
}

/**
 * Sets up PaginationFilter options param object
 * @protected
 * @param {Object} opts Config object
 * @param {Number|string} opts.length Indicates page length
 * @param {Number|string} opts.page Indicates page number
 * @returns {Object} Options param object ready to pass to PaginationFilter constructor
 */
function setupPaginationOptions(opts) {
    const readOpts = {};
    if (opts.length) {
        readOpts.length = parseInt(opts.length);
    }
    if (opts.page) {
        readOpts.page = parseInt(opts.page);
    }
    return readOpts;
}

/**
 * Paginates model arrays post-query (be sure to call this after all other filtering)
 * @protected
 * param {Object} opts Config object (can be constructed using setupPaginationOptions)
 * @param {Array} models Array of models to paginate
 * @returns {Array} Array of models for the specified page
 */
function paginate(opts, models) {
    const filterOpts = setupPaginationOptions(opts);
    return (new PaginationFilter(filterOpts).filter(models));
}

module.exports = {
    fetchAllReviews: (opts={}) => {
        return auth.auth().then(authClient => {
            const readOpts = setupPaginationOptions(opts);
            return reviewReader.read(authClient);
        }).then(reviews => {
            let filteredReviews = filterApproved(opts, reviews); // filter out based on approval, if specified in options
            filteredReviews = paginate(opts, filteredReviews); // paginate, if specified in options
            return filteredReviews;
        });
    },
    fetchProductReviews: (sku, opts={}) => {
        return auth.auth().then(authClient => {
            const readOpts = setupPaginationOptions(opts);
            return reviewReader.read(authClient);
        }).then(reviews => {
            let filteredReviews = filterApproved(opts, reviews); // filter out based on approval, if specified in options
            filteredReviews = (new ReviewModelFilter({productId: sku}).filter(filteredReviews)); // filter out to only contain products with specified ID
            filteredReviews = paginate(opts, filteredReviews); // paginate, if specified in options
            return filteredReviews;
        });
    }
}
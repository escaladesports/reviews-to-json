/**
 * Class defining filters that can be used to filter groups of ReviewModels based on injected options
 * @constructor
 * @param {Object} filterOpts Object with key-value pairs defined to match which models should pass the filter
 * For example, to match any ReviewModels that have reviewApproved set to "true", pass in {reviewApproved: true}
 */
function ReviewModelFilter(filterOpts) {
    if (filterOpts && typeof filterOpts !== 'object') {
        throw new Error('ReviewModelFilter expects an object (or nothing) as its first param, but was passed '+typeof filterOpts);
    }
    this.filterOpts = filterOpts || {};
}
/**
 * Filters an array of ReviewModels based on the filter object's defined options
 * @param {Array.<ReviewModel>} models Array of ReviewModels to filter
 * @returns {Array} Array containing ReviewModels that match the filter
 */
ReviewModelFilter.prototype.filter = function(models) {
    if (!Array.isArray(models)) {
        throw new Error('ReviewModelFilter.filter expects an array as its first parameter');
    }

    const opts = this.filterOpts;
    let filteredModels = models; // contains all models that have passed the most recent filter key-check (initially set to all models)

    for (key in opts) { // iterate over all filter keys
        let currentMatchModels = []; // contains all models that have passed the currently running filter key-check
        for (var i=0; i<filteredModels.length; i++) { // iterate over all models that have passed any previous filter key-check iterations
            if (filteredModels[i][key] === opts[key]) {
                currentMatchModels.push(filteredModels[i]);
            }
        }
        filteredModels = currentMatchModels;
    }

    return filteredModels;
}

module.exports = ReviewModelFilter;

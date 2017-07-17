/**
	Module that fetches data from a Product Reviews API and writes it to JSON files
	@module reviews-to-json
*/

require('es6-promise').polyfill();
require('isomorphic-fetch');


/**
	Fetch review average for product(s)
	@protected
	@param {Array.<Object>} reviews Array of product reviews to calculate the average with
	@returns {Number} Numeric average of all reviews passed to function
*/
 calculateProductAverage = (reviews) => {

}

module.exports = {
	/**
		Fetch reviews for product(s) and write them to one JSON file per product
		@param {Array.<string>} skus Array of SKUs, one for each product to fetch
		@param {Object} config Config object
		@param {string} config.outputDir Directory to write output files to
		@param {string} config.apiUrl API base URL
		@param {string} config.apiKey API private key
		@returns {Promise.<boolean|Error>} Promise resolving to true if fetch/write was a success, resolves to an error upon failure
	*/
	fetchProductReviews: (skus, {outputDir, apiKey, apiUrl}) => {

	}
};
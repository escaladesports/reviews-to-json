/**
	Module that fetches data from a Product Reviews API and writes it to JSON files
	@module reviews-to-json
*/

require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports = {
	/**
		Fetch reviews for product(s) and write them to one JSON file per product
		@param {Array.<string>} skus Array of SKUs, one for each product to fetch
		@param {Object} config Config object
		@param {string} [config.outputDir='./products'] Directory to write output files to (optional, defaults to './products')
		@param {string} config.apiUrl API base URL
		@param {string} config.apiKey API private key
		@returns {Promise.<boolean|Error>} Promise resolving to true if fetch/write was a success, resolves to an error upon failure
		@example
		// fetches product reviews for products 'B6101W', 'B3101W', 'B3300W' and writes them to one JSON file per product in the directory './productReviews'
		// returns a promise that should resolve to true (assuming the API responds successfully)
		reviewsToJson.fetchProductReviews([
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
			apiUrl: 'https://my-reviews-api.herokuapp.com',
			apiKey: 'MY_API_KEY'
		});
	*/
	fetchProductReviews: (skus, {outputDir = './products', apiKey, apiUrl}) => {
	}
};
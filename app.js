/**
	Module that fetches data from a Product Reviews API and writes it to JSON files
	@module reviews-to-json
*/

require('es6-promise').polyfill();
require('isomorphic-fetch');

/**
	Fetch reviews for single product with specified SKU and return them
	@protected
	@param {string} sku Product SKU
	@param {Object} config Config object
	@param {string} config.apiUrl API base URL
	@param {string} config.apiKey API private key
	@returns {Promise.<Array|Error>} Promise resolving to an array of reviews if fetch was a success, or an error upon failure/error
*/
fetchSingleProductReviews = (sku, {apiKey, apiUrl}) => {
	const fetchUrl = apiUrl + '/api/reviews/'+(sku.toUpperCase()); // SKUs are currently stored in all uppercase
	return fetch(fetchUrl).then(response => {
		if (response.status >= 400) {
			return Promise.reject(new Error('Server returned response code '+response.status));
		}
		return response.json();
	});
}

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
		if (!skus || !Array.isArray(skus)) {
			return Promise.reject(new Error('fetchPromiseReviews expects array of product SKUs as first param'));
		}
		if (!apiKey) {
			return Promise.reject(new Error('fetchProductReviews expects config object with apiKey defined'));
		}
		if (!apiUrl) {
			return Promise.reject(new Error('fetchProductReviews expects config object with apiUrl defined'));
		}

		const fetchPromises = [];
		for (sku of skus) {
			if (typeof sku !== 'string') {
				return Promise.reject(new Error('SKUs must be a string'));
			}
			fetchPromises.push(fetchSingleProductReviews(sku, {apiKey, apiUrl}));
		}
		return Promise.all(fetchPromises).then(values => {
			console.log('Fetched reviews for '+values.length+' specified products: ');
			console.dir(values);
			return values;
		});
	}
};

// test
module.exports.fetchProductReviews(['b6101w', 'b3300w'], {apiKey: 'TEST', apiUrl: 'https://goalrilla-reviews-api-staging.herokuapp.com'});
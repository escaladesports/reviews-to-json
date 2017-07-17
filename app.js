/**
	Module that fetches data from a Product Reviews API and writes it to JSON files
	@module reviews-to-json
*/

require('es6-promise').polyfill();
require('isomorphic-fetch');
const jsonfile = require('jsonfile');
const reviewAverageCalc = require('./src/reviewAverageCalc.js');

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

/**
	Structures single product's fetched information (and adds in calculated values, etc.)
	in preparation for writing to JSON file
	@protected
	@param {Array} productReviews Array of reviews for a single product
	@returns {Object}
*/
structureSingleProductReviews = (productReviews) => (
	{
		sku: productReviews[0].productId.toLowerCase(),
		reviews: productReviews,
		reviewAverage: reviewAverageCalc.calculateProductAverage(productReviews)
	}
);

/**
	Writes single product's fetched information to a JSON file
	@protected
	@param {Object} productData Object (must be valid JSON structure) to write to file
	@param {string} outputDir Directory to write file to
	@returns {Promise.<string|Error>} Promise resolving to file name if write was a success, or an error if it failed
*/
writeProductFile = (productData, outputDir) => {
	const fileName = outputDir + '/' + productData.sku + '-reviews.json';
	return new Promise((resolve, reject) => {
		jsonfile.writeFile(fileName, productData, (err) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(fileName);
			}
		});
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
		@returns {Promise.<Array.<string>|Error>} Promise resolving to an array of file names, resolves to an error upon failure
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
	fetchWriteProductReviews: (skus, {outputDir = './products', apiKey, apiUrl}) => {
		// check for all neccessary data
		if (!skus || !Array.isArray(skus)) {
			return Promise.reject(new Error('fetchWriteProductReviews expects array of product SKUs as first param'));
		}
		if (!apiKey) {
			return Promise.reject(new Error('fetchWriteProductReviews expects config object with apiKey defined'));
		}
		if (!apiUrl) {
			return Promise.reject(new Error('fetchWriteProductReviews expects config object with apiUrl defined'));
		}

		const fetchPromises = [];

		// check all SKUs and then push in the fetch promise
		for (sku of skus) {
			if (typeof sku !== 'string') {
				return Promise.reject(new Error('SKUs must be a string'));
			}
			fetchPromises.push(fetchSingleProductReviews(sku, {apiKey, apiUrl}));
		}

		// fetch all
		return Promise.all(fetchPromises).then(values => {
			// restructure product reviews to contain correct structure + additional data
			const structuredValues = values.map(product => structureSingleProductReviews(product));
			const writePromises = structuredValues.map(product => writeProductFile(product, outputDir));
			return Promise.all(writePromises);
		});
	}
};
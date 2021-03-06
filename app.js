/**
	Module that fetches data from a Product Reviews API and writes it to JSON files
	@module reviews-to-json
*/
const fse = require('fs-extra');
const reviewAverageCalc = require('./src/reviewAverageCalc.js');
const reviewReader = require('./src/review-reader/mainReviewReader.js');

groupProductReviews = (reviews) => {
	const groupedProducts = {};

	for (let review of reviews) {
		const productId = review.productId;
		if (!groupedProducts[productId]) {
			groupedProducts[productId] = {
				sku: productId,
				reviews: [ review ],
				reviewAverage: reviewAverageCalc.calculateProductAverage([review])
			};
		}
		else {
			const product = groupedProducts[productId];
			product.reviews.push(review);
			product.reviewAverage = reviewAverageCalc.calculateProductAverage(product.reviews)
		}
	}

	return groupedProducts;
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
		sku: productReviews[0].productId.toLowerCase(), // RIGHT HERE is probably what needs fixing...
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
	return fse.outputJson(fileName, productData).then(data => {
		return fileName;
	});
}

module.exports = {
	/**
		Fetch reviews for product(s) and write them to one JSON file per product
		@param {Array.<string>} skus Array of SKUs, one for each product to fetch
		@param {Object} dataStoreConfig Object containing datastore configuration
		@param {string} dataStoreConfig.spreadsheetId Google sheets spreadsheet ID
		@param {string} dataStoreConfig.sheetName Spreadsheet sheet name to fetch from
		@param {Number} dataStoreConfig.rowSkip Number of rows above data rows dedicated to headers, etc.
		@param {Array.<Object>} dataStoreConfig.schema Array of spreadsheet columns in format {col: "A", modelKey: "reviewApproved"}
		@param {Object} config Request config object
		@param {string} [config.outputDir='./products'] Directory to write output files to (optional, defaults to './products')
		@param {boolean} [config.approved] Specifies whether to filter reviews on approval status (true = approved, false = unapproved, undefined = both)
		@param {Number|string} [config.page] Specifies whether to paginate each set of reviews
		@param {Number|string} [config.length] Specifies page length (or acts as a length limit if page is not specified)
		@returns {Promise.<Array.<string>|Error>} Promise resolving to an array of file names, resolves to an error upon failure
		@example
		// fetches product reviews for products 'B6101W', 'B3101W', 'B3300W' and writes them to one JSON file per product in the directory './productReviews'
		// returns a promise that should resolve to true (assuming the API responds successfully)
		reviewsToJson.fetchWriteProductReviews([
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
		});
	*/
	fetchWriteProductReviews: (skus, dataStoreConfig, {outputDir = './products', approved, length, page}={}) => {
		// check for all neccessary data
		if (!skus || !Array.isArray(skus)) {
			return Promise.reject(new Error('fetchWriteProductReviews expects array of product SKUs as first param'));
		}

		const fetchPromises = [];

		// check all SKUs and then push in the fetch promise
		for (sku of skus) {
			if (typeof sku !== 'string') {
				return Promise.reject(new Error('SKUs must be a string'));
			}
			fetchPromises.push(reviewReader.fetchProductReviews(sku, dataStoreConfig, {approved, length, page}));
		}

		// fetch all
		return Promise.all(fetchPromises).then(values => {
			// restructure product reviews to contain correct structure + additional data
			const structuredValues = values.filter(product => product.length > 0) // filter out products with no reviews
			.map(product => structureSingleProductReviews(product));
			// write all product files
			const writePromises = structuredValues.map(product => writeProductFile(product, outputDir));
			return Promise.all(writePromises);
		});
	},
	fetchWriteAllProductReviews: (dataStoreConfig, {outputDir = './products', approved, length, page}={}) => {
		return reviewReader.fetchAllReviews(dataStoreConfig, {approved, length, page}).then(allReviews => {
			// group reviews by their product ID {B6101W: [...], B3102W: [...]}
			const groupedReviews = groupProductReviews(allReviews);
			// write all product files
			const writePromises = Object.keys(groupedReviews).map(productId => writeProductFile(groupedReviews[productId], outputDir));
			return Promise.all(writePromises);
		});
	}
};
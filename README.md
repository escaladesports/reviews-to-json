# reviews-to-json
Fetches product reviews from product review API and writes them to JSON files

## Installation
`yarn`

## Use

### Fetch all approved reviews
	const reviewsToJson = require('reviews-to-json');
	reviewsToJson.fetchWriteProductReviews(
		[
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
			approved: true, // fetch only approved reviews; use false for unapproved, or leave undefined for both
		}
	).then(filePaths => {
		// ...
	});

### Fetch up to 3 reviews per-product
	const reviewsToJson = require('reviews-to-json');
	reviewsToJson.fetchWriteProductReviews(
		[
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
			approved: true, // fetch only approved reviews; use false for unapproved, or leave undefined for both
			length: 3
		}
	).then(filePaths => {
		// ...
	});

### Fetch each product paginated with a page length of 3
	const reviewsToJson = require('reviews-to-json');
	reviewsToJson.fetchWriteProductReviews(
		[
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
			approved: true, // fetch only approved reviews; use false for unapproved, or leave undefined for both
			page: 2,
			length: 3 // this will skip the first three reviews (page 1) and fetch reviews number 4-6 in the datastore (page 2)
		}
	).then(filePaths => {
		// ...
	});

## Testing
To run all unit tests (using Mocha), run `yarn test`
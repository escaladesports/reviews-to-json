# reviews-to-json
Fetches product reviews from product review API and writes them to JSON files

## Installation
`yarn`

## Use
	const reviewsToJson = require('reviews-to-json');
	reviewsToJson.fetchWriteProductReviews(
		[
			'B6101W', 'B3101W', 'B3300W'
		],
		{
			outputDir: './productReviews',
			apiUrl: 'https://my-reviews-api.herokuapp.com',
			apiKey: 'MY_API_KEY'
		}
	).then(filePaths => {
		// ...
	});

## Testing
To run all unit tests (using Mocha), run `yarn test`
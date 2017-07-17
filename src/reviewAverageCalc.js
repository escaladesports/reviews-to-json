module.exports = {
	/**
		Fetch review average for product(s)
		@param {Array.<Object>} reviews Array of product reviews to calculate the average with
		@returns {Number} Numeric average of all reviews passed to function
	*/
	 calculateProductAverage: (reviews) => {
	 	let average = 0;
	 	for (review of reviews) {
	 		if (!review.productRating || isNaN(review.productRating)) {
	 			throw new Error('All reviews must have an integer productRating property specified. instead found '+review.productRating);
	 		}
	 		average += review.productRating;
	 	}
	 	return (average / reviews.length);
	}
}
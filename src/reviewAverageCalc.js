module.exports = {
	/**
		Fetch review average for product(s)
		@param {Array.<Object>} reviews Array of product reviews to calculate the average with
		@returns {Number} Numeric average of all reviews passed to function
	*/
	 calculateProductAverage: (reviews) => {
	 	let total = 0;
	 	for (review of reviews) {
	 		const rating = parseInt(review.productRating);
	 		if (!review.productRating || isNaN(rating)) {
	 			throw new Error('All reviews must have an integer productRating property specified. instead found '+review.productRating);
	 		}
	 		total += rating;
	 	}
	 	return (total / reviews.length);
	}
}
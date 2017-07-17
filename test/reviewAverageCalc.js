// force test mode
process.env.NODE_ENV = 'test';

// dependencies
const chai = require('chai');
const reviewAverageCalc = require('../src/reviewAverageCalc.js');

// chai setup
const should = chai.should();
const expect = chai.expect;

// test suite
describe('reviewAverageCalc', () => {
	it('should calculate an average based on main rating assigned to each product review', done => {
		const reviews = [
			{productRating: 5},
			{productRating: 3},
			{productRating: 1},
			{productRating: 4},
			{productRating: 5}
		];
		const expectAverage = 3.6;
		const testAverage = reviewAverageCalc.calculateProductAverage(reviews);
		testAverage.should.equal(expectAverage);
		done();
	});

	it('should correctly calculate the average if productRating is a number in string form', done => {
		const reviews = [
			{productRating: '5'},
			{productRating: '3'},
			{productRating: 1},
			{productRating: 4},
			{productRating: 5}
		];
		const expectAverage = 3.6;
		const testAverage = reviewAverageCalc.calculateProductAverage(reviews);
		testAverage.should.equal(expectAverage);
		done();
	});

	it('should throw an error if review(s) don\'t have productRating specified', done => {
		const reviews = [
			{productRating: 5},
			{productRating: 3},
			{productRating: 1},
			{productRating: 4},
			{} // missing productRating!
		];
		expect(() => reviewAverageCalc.calculateProductAverage(reviews)).to.throw(Error);
		done();
	});

	it('should throw an error if any review\'s productRating is not a number', done => {
		const reviews = [
			{productRating: 5},
			{productRating: 3},
			{productRating: 1},
			{productRating: 4},
			{productRating: 'I am a string!'}
		];
		expect(() => reviewAverageCalc.calculateProductAverage(reviews)).to.throw(Error);
		done();
	});
});
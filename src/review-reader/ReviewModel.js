/**
 * Represents a product review
 * @constructor
 * @param {Array} data Array containing review data in order of spreadsheet columns
 * @param {Array.<Object>} schema Array containing schema information
 */
function ReviewModel(data, schema) {
    this.reviewApproved;
    this.productId;
    this.submitTimestamp;

    this.userAlias;
    this.userEmail;
    this.userLocation;
    this.userAgeOpt;
    this.userGenderOpt;
    this.userDescriptionOpt;
    this.lengthOwnedOpt;

    this.recommendProduct;
    this.productRating;
    this.qualityRating;
    this.improvesGameRating;
    this.valueRating;

    this.reviewSummary;
    this.reviewBody;

    this.recommendFriend;
    this.recommendFriendReason;

    // setup from raw data array & schema
    for (var i=0; i<data.length; i++) {
        let currentKey = schema[i].modelKey;
        this[currentKey] = data[i];
    }

    if (this.reviewApproved !== true && this.reviewApproved !== 'TRUE') {
        this.reviewApproved = 'FALSE';
    }
}

module.exports = ReviewModel;

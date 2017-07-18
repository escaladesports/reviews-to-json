/**
 * Filters arrays in order to paginate them/limit list length
 * @constructor
 * @param {Object} pageOpts
 * @param {Number} pageOpts.page Current page number
 * @param {Number} pageOpts.length Page length/limit
 */
function PaginationFilter(pageOpts) {
    if (pageOpts && typeof pageOpts !== 'object') {
        throw new Error('PaginationFilter expects an object (or nothing) as its first param, but was passed '+typeof pageOpts);
    }

    if (!pageOpts) {
        pageOpts = {};
    }

    this.pageOpts = {
        page: pageOpts.page || 1,
        length: pageOpts.length || (pageOpts.length === 0 ? 0 : null)
    };
}
/**
 * Paginates or length-limits an array based on options passed to PaginationFilter's constructor
 * @param {Array} models Array to filter
 * @returns {Array} Paginated/length-limited array
 */
PaginationFilter.prototype.filter = function(models) {
    if (!Array.isArray(models)) {
        throw new Error('PaginationFilter.filter expects an array as its first parameter');
    }

    const length = this.pageOpts.length;
    const page = this.pageOpts.page;

    if ((!length) && (length !== 0)) { // nonzero falsy = no length set
        return models;
    }
    else if (length === 0) { // limited to 0
        return [];
    }
    else if (length && !page) { // act as a LIMIT on the query
        return this._limit(models);
    }
    else if (length && page) { // full pagination
        return this._paginate(models);
    }
}
PaginationFilter.prototype._paginate = function(models) {
    const pageStart = this.pageOpts.page;
    const length = this.pageOpts.length;
    return models.slice((pageStart-1) * length, pageStart * length);
}
PaginationFilter.prototype._limit = function(models) {
    return models.slice(0, this.pageOpts.length-1);
}
module.exports = PaginationFilter;

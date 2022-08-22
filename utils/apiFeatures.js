class APIFeatures {
  constructor(queryString) {
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    return JSON.parse(queryStr);
  }

  sort() {
    const sortBy = this.queryString.sort?.split(',').join(' ');
    return sortBy;
  }

  limit() {
    const fields = this.queryString.fields?.split(',').join(' ');
    return fields;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    return { skip, limit };
  }
}

module.exports = APIFeatures;

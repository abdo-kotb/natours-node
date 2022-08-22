const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Modal) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // console.log(req.params.tourId);

    const features = new APIFeatures(req.query);
    const { skip, limit } = features.pagination();

    if (req.query.page) {
      const numDocs = Modal.countDocuments();
      if (skip >= numDocs) throw new Error('This page does not exist!');
    }

    let query = Modal.find(filter);
    query = Modal.find(features.filter())
      .sort(features.sort() ?? '-createdAt')
      .select(features.limit() ?? '-__v')
      .skip(skip)
      .limit(limit);

    const docs = await query;

    res.status(200).json({
      requestedAt: req.requestTime,
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.getOne = (Modal, populateOpts) =>
  catchAsync(async (req, res, next) => {
    let query = Modal.findById(req.params.id);
    if (populateOpts) query = query.populate('reviews');

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Modal) =>
  catchAsync(async (req, res, next) => {
    const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

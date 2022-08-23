const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-tours',
  //bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tour/:tourSlug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);

module.exports = router;

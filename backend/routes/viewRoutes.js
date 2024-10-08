const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Corrected route
router.get('/signup',viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);
router.get('/my-tours', authController.protect, viewController.getMytours);


router.use(authController.isLoggedIn);
router.get('/', bookingController.createBookingCheckout,viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;

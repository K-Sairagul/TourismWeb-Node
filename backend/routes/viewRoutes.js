const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Public routes
router.get('/', authController.isLoggedIn, viewController.getOverview);  // Modified
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);

// Protected routes
router.get('/account', authController.protect, viewController.getAccount);  // Added
router.get('/me', authController.protect, viewController.getAccount);  // Keep for backward compatibility
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
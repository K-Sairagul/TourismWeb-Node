const express = require('express');
const tourController = require('../controllers/tourController');
const authController=require('./../controllers/authController');
// const reviewController=require('./../controllers/reviewController');
const reviewRouter=require('./../routes/reviewRoutes');


const tourRouter = express.Router();

tourRouter
 .route('')
 .get(authController.protect,tourController.Getalltour)
 .post(tourController.createTour);

tourRouter
 .route('/:id')
 .get(tourController.getTour)
 .patch(tourController.updateTour)
 .delete(authController.protect, authController.restrictTo('admin','lead-guide'),
        tourController.deleteTour);

// tourRouter
// .route('/:tourId/reviews')
// .post(authController.protect,
// authController.restrictTo('user'),
// reviewController.createReview
// );


tourRouter.use('/:reviewTour/reviews',reviewRouter);


module.exports = tourRouter;

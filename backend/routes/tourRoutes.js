const express = require('express');
const tourController = require('../controllers/tourController');
const authController=require('./../controllers/authController');
// const reviewController=require('./../controllers/reviewController');
const reviewRouter=require('./../routes/reviewRoutes');


const tourRouter = express.Router();

tourRouter
 .route('')
 .get(tourController.Getalltour)
 .post(authController.protect,
  authController.restrictTo('admin','lead-guide'),
  tourController.createTour);

tourRouter
 .route('/:id')
 .get(tourController.getTour)
 
 .patch(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.updateTour)

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

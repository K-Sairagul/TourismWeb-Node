const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');

const factoy=require('./handlerFactory');
const multer=require('multer');
const AppError=require('./../utils/appError');
const Booking = require('./../models/bookingModel');


exports.getTour = factoy.GetOne(Tour,{path:'reviews'})
exports.updateTour = factoy.UpdateOne(Tour);
exports.deleteTour = factoy.DeleteOne(Tour);
exports.Getalltour = factoy.GetAll(Tour);
exports.createTour = factoy.CreateOne(Tour);

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img/tours');
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `tour-${req.params.id}-${Date.now()}.${ext}`);
    }
  });
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  };
  
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  });
  
  // Middleware to handle multiple image uploads
  exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ]);
  
  // Middleware to process uploaded images
  exports.processTourImages = (req, res, next) => {
    if (req.files) {
      // If an image cover was uploaded, add it to req.body
      if (req.files.imageCover) {
        req.body.imageCover = req.files.imageCover[0].filename;
      }
  
      // If multiple images were uploaded, add them to req.body
      if (req.files.images) {
        req.body.images = req.files.images.map(file => file.filename);
      }
    }
  
    // Proceed to the next middleware
    next();
  };

  // tourController.js




//Like tour functionality
exports.likeTour = async (req, res, next) => {
  try {
    // 1. Check if the user has booked the tour
    const booking = await Booking.findOne({ user: req.user.id, tour: req.params.id });
    
    if (!booking) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only like a tour that you have booked.'
      });
    }

    // 2. Check if the user has already liked this tour
    const user = await User.findById(req.user.id);
    if (user.likedTours.includes(req.params.id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already liked this tour.'
      });
    }

    // 3. Increment the tour's like count and add tour to user's likedTours
    const tour = await Tour.findByIdAndUpdate(req.params.id, {
      $inc: { likes: 1 } // Increment the likes by 1
    }, {
      new: true // Return the updated tour
    });

    // Add tour to user's liked tours
    user.likedTours.push(req.params.id);
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        likes: tour.likes
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Error liking the tour'
    });
  }
};

  
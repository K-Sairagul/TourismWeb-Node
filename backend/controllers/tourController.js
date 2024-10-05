const Tour = require('./../models/tourmodel');
const factoy=require('./handlerFactory');
const multer=require('multer');
const AppError=require('./../utils/appError');

exports.getTour = factoy.getOne(Tour,{path:'reviews'})
exports.updateTour = factoy.updateone(Tour);
exports.deleteTour = factoy.deleteOne(Tour);
exports.Getalltour = factoy.Getall(Tour);
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
  
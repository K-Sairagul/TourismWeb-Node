const Tour= require('../models/tourmodel');
const User= require('../models/usermodel');
const Bookings= require('../models/bookingModel');
const factory=require('./../controllers/handlerFactory');


const AppError = require('../utils/appError');

exports.getOverview=async(req,res,next)=>{
    // 1) Get tour data from collection
    const tours=await Tour.find();


    res.status(200).render('overview',{
        title:'All tours',
        tours
    })
}

exports.getTour = async (req, res, next) => {
  try {
    // Find the tour by the slug and populate the reviews
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      select: 'review rating reviewUser',
    });

    // Check if the tour exists before rendering
    // if (!tour) {
    //   return res.status(404).render('error', {
    //     title: 'Tour not found',
    //     return next(new AppError('Sorry, there is no tour with that name!', 404))
    //   });
    // }

    // Check if the tour exists before rendering
if (!tour) {
  // Use next(new AppError()) to trigger the global error handler
  return next(new AppError('Sorry, there is no tour with that name!', 404));
}


    // If tour exists, render the tour page
    res
      .status(200)
      .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      )
      .render('tour', {
        title: `${tour.name} Tour`,
        tour,
      });
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
};


exports.getLoginForm=(req,res)=>{
  res.status(200).render('login',{
    title:'Log into to your account'
  })
}


exports.getAccount=(req,res,next)=>{
  res.status(200).render('account',{
    title:'your account'
    
  })
  next();
}

exports.updateUserData=async(req,res,next)=>{
  const updatedUser= await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },
  {
    new:true,
    runValidators:true
  }
);

res.status(200).render('account',{
  title:'your account',
  user:updatedUser
  
})

}

exports.getMytours=async(req,res,next)=>{
  //1) Find all bookings
  const bookings=await Bookings.find({user:req.user.id})

  //2) Find tours with returned Id
  const tourIDs=bookings.map(el=>el.tour);
  const tours=await Tour.find({_id:{$in:tourIDs}});

  res.status(200).render('overview',{
    title:'Booked tours',
    tours
  })
}



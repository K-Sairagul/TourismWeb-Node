const Review=require('./../models/reviewModel');
const factoy=require('./handlerFactory');

exports.getAllReviews=async(req,res,next)=>{
     let filter={}
    if(req.params.reviewTour) filter={reviewTour:req.params.reviewTour}
    const reviews= await Review.find(filter);

    res.status(200).json({
        status:'success', 
        message:'The data was fetched successfylly from review',
        data:{
            allReview:reviews
        }
    })

}

exports.setTourId=(req,res,next)=>{
    if (!req.body.reviewTour) req.body.reviewTour = req.params.reviewTour;
    if (!req.body.reviewUser) req.body.reviewUser = req.user.id; // assuming user ID is in req.user
    next();
}

exports.createReview = factoy.CreateOne(Review);
exports.deleteReview=factoy.deleteOne(Review);
exports.updateReview=factoy.updateone(Review);
exports.GetallReview=factoy.Getall(Review);

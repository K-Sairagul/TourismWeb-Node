const User= require("./../models/usermodel");
const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const sendEmail= require('./../utils/email');
const AppError = require("./../utils/appError");
const crypto=require('crypto');

const signToken=id=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_IN
  },
);
}

const createSendToken=(user,statusCode,res)=>{
  const token=signToken(user._id)
  // console.log(process.env.JWT_COOKIES_EXPIRES_IN);
  


  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true
  }

if(process.env.NODE_ENV==='production') cookieOptions.secure=true;

res.cookie('jwt',token,cookieOptions)
// console.log(cookieOptions);
  

  res.status(statusCode).json({
      status:'success',
      token,
      data:{
          user
      }
   })
}

//User Creating process
exports.signup= async(req,res,next)=>{
 try{

    const newUser= await User.create({
        role:req.body.role,
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation
       
    });

    createSendToken(newUser,201,res);
  

   

}  
catch(err){
    console.error('Error during user creation:', err);
    res.status(400).json({
        
        status: 'fail',
        message: "There is an error in creating user",
        error: err.message // Include the actual error message for more details
      });
}
}


//Login process
exports.login=async(req,res,next)=>{
    const{email,password}=req.body

    //checking weather the password or email is there are not
    // if(!email || !password){
    //   return next(new AppError( "please provide password or email while login!",400));
    // }

    // checking weather the user password and mail id are crt
    const user= await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError("Enter the crt pass or email",401))
    }

   


    // if the passwords are crt it move here
    createSendToken(user,200,res);
}


exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('You are not logged in. Please log in as a user.', 401));
    }
  
  //   try {
  
  //     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //  } catch (err) {
  //     console.error('Error verifying token:', err);
  //     return next(new AppError('Invalid token. Please log in again.', 401));
  //   }

  //   const freshUser= await User.findById(decoded.id);
  //   if(!freshUser){
  //     return next(new AppError('The user does not exizt',401));
  //   }

  //   next();


  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to the token does not exist', 401));
    }

    if(currentUser.changePasswordAfter(decoded.iat)){
      return next( new AppError('User recently changed the password! please login again.',401)
     );
    }

    //grand access to the protected route
    req.user=currentUser;
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
  }


  // used to delete tours by admin
  exports.restrictTo=(...roles)=>{
    return(req,res,next)=>{
      if(!roles.includes(req.user.role)){
        return next(new AppError("you need permission to perform this action",403));
      }
      next();
    }

  };


// 2.forgot password and resetToken part
  exports.forgotPassword=async(req,res,next) => {
    const user= await User.findOne({email:req.body.email});
    if(!user){
      return next(new AppError('There is no user with the given email address',404))
    }


    // generate random token
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Forgot your password? Submit a PATCH request with your new password and password confirmation to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message,
      });
    
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    
    } catch (err) {
      console.error('Error details:', err);
    
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    
      return next(new AppError('There was an error sending the email. Please try again later!', 500));
    }
  }




  exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)  // Ensure req.params.token is defined and coming from the request URL
            .digest('hex');

        // Find the user by the hashed token and check if the token has not expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // If the token is invalid or expired
        if (!user) {
            return next(new AppError('Token is invalid or expired', 400));
        }

        // Set the new password and invalidate the reset token
        user.password = req.body.password;
        user.passwordConfirmation = req.body.passwordConfirmation;

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // Save the updated user data without validating passwordConfirmation
        await user.save();

       createSendToken(user,200,res);
       
  } catch (err) {
      console.error('Error details:', err);
      res.status(500).json({
          status: 'fail',
          message: 'An error occurred while resetting the password. Please try again later.',
          error: err.message // Provide a detailed error message
      });
  }
};

exports.updatePassword= (async(req,res,next)=>{

  //1)checking if the user is available or not in online
  const user= await User.findById(req.user.id).select('password');

  //2) check if the current posted password is crt
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    return next(new AppError('Your current password id wrong',401));
  }

  //3)if the password is crt
  user.password=req.body.password;
  user.passwordConfirmation=req.body.passwordConfirmation;
  await user.save();

  //4) log user in, send Jwt
  
  createSendToken(user,201,res);

  });










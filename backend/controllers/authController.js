const User= require("./../models/usermodel");
const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const Email= require('./../utils/email');
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


  // Setting time and security
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true
  }


//setting weather it is production or not
if(process.env.NODE_ENV==='production') cookieOptions.secure=true;


//setting cookie to the broswer as cache
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
        photo: req.body.photo,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation
       
    });
    const url=`${req.protocol}://${req.get('host')}/me`
    console.log(url);
    await new Email(newUser,url).sendWelcome()
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
};


//Logout thing
exports.logout=(req,res)=>{
  res.cookie('jwt','loggedout',{
    expires:new Date(Date.now()+10*1000),
    httpOnly:true
  });

  res.status(200).json({status:'success'})
}


//Protecting this by using bearear token
exports.protect = async (req, res, next) => {
  let token;
  
  // 1. Check if token is in headers (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token is in cookies (use cookies as fallback)
  else if (req.cookies.jwt) {
      token = req.cookies.jwt;
  }

  // 3. If no token found, send error
  if (!token) {
      return next(new AppError('You are not logged in. Please log in as a user.', 401));
  }

  try {
      // 4. Verify the token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // 5. Check if the user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
          return next(new AppError('The user belonging to this token no longer exists.', 401));
      }

      // 6. Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {
          return next(new AppError('User recently changed the password. Please log in again.', 401));
      }

      // 7. Grant access to protected route
      req.user = currentUser;
      res.locals.user = currentUser;

      next();
  } catch (err) {
      console.error('Error verifying token:', err);
      return next(new AppError('Invalid token. Please log in again.', 401));
  }
  
};


//Checking weather it is user or not
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();  // Always call next to pass control to the next middleware
};

  


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
    
    
    try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user,resetURL).sendPasswordReset()
    
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










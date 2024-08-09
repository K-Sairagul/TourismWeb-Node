const User= require("./../models/usermodel");
const jwt=require('jsonwebtoken');

const AppError = require("./../utils/appError");

//User Creating process
exports.signup= async(req,res,next)=>{
  
 try{

    const newUser= await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirmation:req.body.passwordConfirmation
    });

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
     })

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
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
        status:'success',
        token
    });
}

exports.protect=async(req,res,next)=>{
    let token
  if(req.headers.authorization && req.headers.authorization.startsWith('kutty')
 ){
     token=req.headers.authorization.split(' ')[1];
  }
if(!token){
    return next(new AppError('you are not logged in please login as a user',401));
  
}
    next();
}
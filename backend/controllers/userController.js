const User = require("../models/usermodel");
const AppError = require("./../utils/appError");
const multer=require('multer');
// const sharp= require('sharp');

const factoy=require('./handlerFactory');

const multerStorage=multer.diskStorage({
  destination:(req, file,cb)=>{
    cb(null,'public/img/users')
  },
  filename:(req,file,cb)=>{
    const ext=file.mimetype.split('/')[1];
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);

  }
})

const multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }else{
    cb(new AppError('Not an image! Please upload only images.', 404), false);

  }
}
const upload=multer({
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.uploadUserPhoto=upload.single('photo')



const filterObj=(obj,...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) newObj[el]=obj[el];
  })
    return newObj       
}


exports.getMe=async(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}


  exports.updateMe=(async(req,res,next)=>{
    //1) create error if user post password.. used for updating user name not password stuffs
    if(req.body.password || req.body.passwordConfirmation){
      return next(new AppError('This route is not defined "UpdateMe like my data" go the forgotmypassword route to update pass',404))
  }

   //2)Filtering fields
    const filterBody= filterObj(req.body,'name','email');
    if(req.file) filterBody.photo=req.file.filename;
   //updating the fields
    const updateUser= await User.findByIdAndUpdate(req.user.id,filterBody,{
      new:true,
       runValidators:true
     });
    res.status(200).json({
      status:'success',
      data:{
        user:updateUser
      }
    })
  });

//making user to inactive
  exports.deleteMe=(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})

    res.status(204).json({
      status:'success',
      data:null
    })
  })


// Do not update password with this
exports.updateUser = factoy.updateone(User);

exports.deleteUserOne=factoy.deleteOne(User);
exports.getUser = factoy.getOne(User);
exports.getAllUsers = factoy.Getall(User);





exports.deleteUser = async(req, res) => {
     const deleteuser=await User.deleteMany()
    res.status(201).json({
      status: 'success',
      data:{
        deleteuser
      }
    });
  };
  
const express = require('express');
const userController = require('./../controllers/userController');
const authController= require('./../controllers/authController');
const reviewController=require('./../controllers/reviewController');
const userRouter = express.Router();

userRouter.post('/signup',authController.signup)
userRouter.post('/login',authController.login)

userRouter.post('/forgotpassword',authController.forgotPassword);
userRouter.patch('/resetpassword/:token',authController.resetPassword);
userRouter.patch('/updateMyPassword',authController.protect,authController.updatePassword);

userRouter.patch('/updateMe', authController.protect, userController.updateMe);

userRouter.delete('/deleteMe',authController.protect,userController.deleteMe);



userRouter.patch('/UpdateMyPassword',
authController.protect,
authController.updatePassword);




userRouter
  .route('/')
  .get(userController.getAllUsers)
  

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)

userRouter
.route('/')
  .delete(userController.deleteUser);

userRouter.route('/:id')
.delete(userController.deleteUserOne)


module.exports = userRouter;

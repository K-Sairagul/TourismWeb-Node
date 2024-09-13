const express = require('express');
const userController = require('./../controllers/userController');
const authController= require('./../controllers/authController');
const reviewController=require('./../controllers/reviewController');
const userRouter = express.Router();

userRouter.post('/signup',authController.signup)
userRouter.post('/login',authController.login)
userRouter.post('/forgotpassword',authController.forgotPassword);
userRouter.patch('/resetpassword/:token',authController.resetPassword);

//Protecting all the route after the middleware
userRouter.use(authController.protect)

userRouter.get('/me',authController.protect,
userController.getMe,userController.getUser);

userRouter.patch('/updateMyPassword',
authController.updatePassword);

userRouter.patch('/updateMe',
userController.updateMe);

userRouter.delete('/deleteMe',
userController.deleteMe);

userRouter.patch('/UpdateMyPassword',
authController.updatePassword);

//Admin protection-middleware
userRouter.use(authController.restrictTo('admin'));

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

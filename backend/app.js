const express = require('express');
const app = express();
const rateLimit=require('express-rate-limit');
const morgon = require('morgan');
const helmet=require('helmet');
app.use(express.json()); 


if(process.env.NODE_ENV==='development'){
    app.use(morgon('dev'));
}

// Middleware to parse JSON
const limiter=rateLimit({
    max:100,
    windowMs:60 *60 *1000,
    message:'Too many request from this ip plss try again the hour!'
});

app.use('/api',limiter);

app.use(helmet())

const tourRouter = require('./routes/tourRoutes'); // Ensure the path is correct
const userRouter = require('./routes/userRoutes'); // Ensure the path is correct
const reviewRouter=require('./routes/reviewRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);





module.exports = app; 

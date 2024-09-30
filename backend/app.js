const express = require('express');
const app = express();
const rateLimit=require('express-rate-limit');
const morgon = require('morgan');
const helmet=require('helmet');
const cookieParser=require('cookie-parser')
const path=require('path');
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'))


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

app.use(express.json({limit:'10kb'}));
app.use(cookieParser());

app.use(helmet())

app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    // console.log(req.cookies);
    next();
    
})



const tourRouter = require('./routes/tourRoutes'); // Ensure the path is correct
const userRouter = require('./routes/userRoutes'); // Ensure the path is correct
const reviewRouter=require('./routes/reviewRoutes');
const viewRouter=require('./routes/viewRoutes');
const { log } = require('console');


app.use('/',viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);





module.exports = app; 

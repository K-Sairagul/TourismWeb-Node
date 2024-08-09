const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON

const tourRouter = require('./routes/tourRoutes'); // Ensure the path is correct
const userRouter = require('./routes/userRoutes'); // Ensure the path is correct

//work between req and response cycle
// app.use((req,res,next)=>{
//     console.log("hello i m from middleware");
//     // console.log(req.headers);
//     next();
// })

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



module.exports = app; 

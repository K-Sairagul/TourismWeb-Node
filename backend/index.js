
const dotenv =require('dotenv');
const mongoose=require ('mongoose')


dotenv.config()
const app = require('./app')
const port = process.env.PORT || 8000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected");
        app.listen(port, () => {
            console.log("Server is running on port", port);
        });

    })
    .catch(err=>{
        console.log(err);
    })
    
    


   

   

const mongoose =require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt');
const crypto= require('crypto');

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter your name!']
    },

    email:{
       type:String,
       required:[true, 'Please enter the email!'],
       unique:true,
       lowercase:true,
       validate:[validator.isEmail,'Enter the crt email']
    },

    photo:{
       type:String,
       default:'default.jpg'

    },

   role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },

    password:{
       type:String,
       required:[true,'Pls enter the password'],
       minlength:3,
       select:false
    },

    passwordConfirmation:{ // this would be used only for creating and updating the data
        type:String,
        required:[true,'Pls enter the password'],
        validate:function(el){
            return el===this.password
        },

        message:"Passwords are not same"
    },

    passwordChangedAt:{
        type:Date,
        default: new Date(),
        
    },

    passwordResetToken:{
    type:String
    },

    passwordResetExpires:{
        type:Date
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }



});

UserSchema.pre('save', async function(next){
    //only run when the password is not modified
   if(!this.isModified('password')) return next();

   this.password=await bcrypt.hash(this.password,12);
   this.passwordConfirmation=undefined;
   next();
});

UserSchema.pre('save',function(next) {
    if(!this.isModified('password') || this.isNew)return next();

    this.passwordChangedAt=Date.now()-1000;
    next();
    
 });

UserSchema.pre(/^find/,function(next){
this.find({active:{$ne:false}});
next();
})



UserSchema.methods.correctPassword=async function(canditatePassword,userPassword){
    return await bcrypt.compare(canditatePassword,userPassword);
};




UserSchema.methods.changePasswordAfter = function(JWTTimesstamp){

    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimesstamp< changedTimestamp;
       
       // console.log(changedTimestamp, JWTTimesstamp);   used to check when jwt created and date for password verification  
    }

    return false;
}


UserSchema.methods.createResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');

    this.passwordResetToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken},this.passwordResetToken);

    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
}    


    const User= mongoose.model('User',UserSchema)
    module.exports=User

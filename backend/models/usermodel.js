const mongoose =require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt');

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
       type:String
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
    }
});

UserSchema.pre('save', async function(next){
    //only run when the password is not modified
   if(!this.isModified('password')) return next();

   this.password=await bcrypt.hash(this.password,12);
   this.passwordConfirmation=undefined;
   next();
});

UserSchema.methods.correctPassword=async function(canditatePassword,userPassword){
    return await bcrypt.compare(canditatePassword,userPassword);
}

    const User= mongoose.model('User',UserSchema)
    module.exports=User

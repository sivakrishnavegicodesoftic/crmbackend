
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const  User = require('../models/users-schema')

const HttpError = require('../models/http-error');
const {  sendEmail } = require('../services/mail.service');
const {forgetHTML } = require('../tempalates/signUpHtml');
const { sentryCapture } = require('../services/sentry.service');

const {generateOTP} = require('../util/genarateOtp');


// const generateOTP = () => {
//     // Declare a digits variable
//     // which stores all digits
//     const digits = '0123456789';
//     let OTP = '';
//     for (let i = 0; i < 4; i += 1) {
//       OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     return OTP;
//   };
  

// getting users list
const getUsersList = async (req, res, next) => {
    let users
    try{
        users = await User.find({ role : 'customer' },'-password')
    }
    catch(err){
        const error = new HttpError("can not fetch users complete request",500)
        return next(error)
    }
    res.json({ users : users.map( user => user.toObject({ getters : true}))})
    
}



//user login 
const  userLogin = async(req, res, next) => {
    const { email,password } = req.body;

    let existingUser
    try{
         existingUser = await User.findOne({ email : email , role : 'customer' })
    }
    catch(err){
        const error = await new HttpError("something went wrong,logging in failed",500)
        return next(error)
    }

    if(!existingUser){
        const error = new HttpError("invalid credentials could not log in",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(password, existingUser.password)
   }
   catch(err){
    const error = await new HttpError("invalid credentials try again",500)
    return next(error)
}

if(!isValidPassword){
    const error = new HttpError("invalid credentials could not log in",401)
    return next(error)
}

let token;
try{
  token = await jwt.sign({
      userId : existingUser.id,
      email : existingUser.email ,
      role : existingUser.role},
      process.env.JWT_KEY,
      {expiresIn :'1h'}
      )

}
catch (err) {
  const error = new HttpError(
    'LogIn failed, please try again.',
    500
  );
  return next(error);
} 

res.json({ 
    message : 'customer logged in successful' , 
    userId : existingUser.id,
    email : existingUser.email , 
    role : existingUser.role ,
    token: token})



}


// forget Password otp email verfication
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (email) {
      try {
        const user = await User.findOne({
          email,
        });
        if (!user) {
          return res.send({ code: 404, msg: 'User not found' });
        }
        const otp = generateOTP();
        const html = forgetHTML(user.name, otp);
  
        await User.updateOne({ _id: user._id }, { otpHex: otp });
        await sendEmail(user.email, html);
        return res.send({
          code: 200,
          
          email: user.email,
          msg: 'OTP send to Your Email.',
        });
      } catch (err) {
        
        console.log(err);
        return res.send({ code: 500, msg: 'Internal server error' });
      }
    }
    return res.send({
      code: 400,
      msg: 'Email is required',
    });
  };


  //verify otp
const otpVerify = async (req, res) => {
    const { otp, email } = req.body;
    if (otp && email) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.send({ code: 404, msg: 'User not Found' });
        }
        if (user.otpHex !== otp) return res.send({ code: 400, msg: 'Wrong OTP' });
        await User.updateOne({ email }, { isVerified: true });
        return res.send({ code: 200, email: user.email, name: user.name });
      } catch (err) {
        sentryCapture(err);
        console.log(err);
        res.send({ code: 500, msg: 'Internal Server Error' });
      }
    }
    return res.send({ code: 400, msg: ' OTP required' });
  };



exports.getUsersList = getUsersList;
exports.userLogin = userLogin;
exports.forgetPassword = forgetPassword;
exports.otpVerify = otpVerify;


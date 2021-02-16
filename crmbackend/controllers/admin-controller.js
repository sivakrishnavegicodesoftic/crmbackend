
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { validationResult } = require('express-validator')
const  User = require('../models/users-schema')

const HttpError = require('../models/http-error');


// getting users list
const getAdminsList = async (req, res, next) => {
    let users
    try{
        users = await User.find({ role : 'admin' },'-password')
    }
    catch(err){
        const error = new HttpError("can not fetch users complete request",500)
        return next(error)
    }
    res.json({ users : users.map( user => user.toObject({ getters : true}))})
    
}


//creating users
const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { name, email,role, password } = req.body;
   
     
    let existingUser
    try{
         existingUser = await User.findOne({ email : email })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a user failed",500)
        return next(error)
    }
    if(existingUser){
        const error = new HttpError("user already exists",422)
        return next(error)
    }
  
    
    let hashedPassword;
  
   try{
    hashedPassword = await bcrypt.hash(password, 12)
   } 
   catch(err){
       const error = new HttpError("cold not create user",500);
       return next(error)
   }


    const createdUser = new User({
        name,
        email,
        role,
        password: hashedPassword,
     
    })

    try {
        await createdUser.save();
      } catch (err) {
        const error = new HttpError(
          'Creating user failed, please try again.',
          500
        );
        return next(error);
      }

      let token;
      try{
        token = await jwt.sign({
            userId : createdUser.id,
            email : createdUser.email,
            role: createUser.role },
            process.env.JWT_KEY,
            {expiresIn :'1h'}
            )

      }
     catch (err) {
        const error = new HttpError(
          'CreatingUser failed, please try again.',
          500
        );
        return next(error);
      }
    
     
    res.status(201).json({ userId : createdUser.id,email : createdUser.email ,role : createdUser.role, token: token})
}


//admin login 
const  adminLogin = async(req, res, next) => {
    const { email,password } = req.body;

    let existingUser
    try{
         existingUser = await User.findOne({ email : email , role : 'admin' })
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
    message : 'admin logged in successful' , 
    userId : existingUser.id,
    email : existingUser.email , 
    role : existingUser.role ,
    token: token})



}





exports.createUser =    createUser;
exports.getAdminsList = getAdminsList;
exports.adminLogin = adminLogin;

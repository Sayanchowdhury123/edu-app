const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypts = require("bcryptjs");

exports.registeruser = async(req,res) => {
    try{
     const {name,email,password,role} = req.body;
  
     const userexists = await User.findOne({email});

     if(userexists){
      return  res.status(400).json({message: "user already exists"})  
     }
    const salt = await bcrypts.genSalt(10)
     const hashedpassword = await bcrypts.hash(password,salt);

     const newuser = new User({
        name,
        email,
        password: hashedpassword,
        role
     });
 
     await newuser.save();

  res.status(201).json({message: "user registered successfully"})
    }catch(error){
        res.status(500).json({message: "registration error", error})
        console.log(error);
    }
}


exports.loginuser = async(req,res) => {
    try{

const {email,password} = req.body;


const user = await User.findOne({email});

if(!user){
    return  res.status(400).json({message: "invalid crediatials"})  ;
}

const ismatch = bcrypts.compare(password,user.password);
if(!ismatch){
    return  res.status(400).json({message: "invalid crediatials"})  ;
}

const token = jwt.sign({id: user._id}, process.env.JWT , {expiresIn: "14d"});

  

   res.status(200).json({
       user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
       },
       token
   });

    }catch(error){
        res.status(500).json({message: "server error"})
        console.log(error);
    }
}


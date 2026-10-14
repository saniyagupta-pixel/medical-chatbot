// const express=require('express')
const User=require("../model/User");
const bcrypt=require("bcrypt")


exports.postSignUp=async (req,res,next)=>{
    try{const {name,email,password}=req.body;

    const existinguser= await User.findOne({
        email
    })
    if(existinguser){
        return res.status(400).json({message:"user already exists"});
    }
    
    const hashedPassword=await bcrypt.hash(password,10)
    const user=await User.create({
        name:name,
        email:email,
        password:hashedPassword
    });

    req.session.userId=user._id;

    res.json({message:"signup successfull",user});}
    catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.postloginpage=async (req,res,next)=>{
    try{const {email,password}=req.body;

    const user=await User.findOne({email});

    if(!user){
        return res.status(404).json({message:"user not found"});
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({message:"incorrect credentials"})
    }

    req.session.userId=user._id;

    res.json({
  message: "login successfull",
  user
});}
    catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.postlogout=(req,res,next)=>{
    req.session.destroy();

    res.json({message:"logged out"});
}


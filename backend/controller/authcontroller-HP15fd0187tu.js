// const express=require('express')
const User=require("../model/User");
const bcrypt=require("bcrypt")

const createSession = (req, userId) =>
    new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) return reject(error);
            req.session.userId = userId.toString();
            req.session.save((saveError) => {
                if (saveError) return reject(saveError);
                resolve();
            });
        });
    });

const publicUser = (user) => {
    const safeUser = user.toObject();
    delete safeUser.password;
    return safeUser;
};

exports.postSignUp=async (req,res,next)=>{
    try{
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        return res.status(400).json({message:"Enter your name, a valid email, and a password of at least 8 characters"});
    }

    const existinguser= await User.findOne({
        email
    })
    if(existinguser){
        return res.status(409).json({message:"An account with this email already exists"});
    }
    
    const hashedPassword=await bcrypt.hash(password,10)
    const user=await User.create({
        name:name,
        email:email,
        password:hashedPassword
    });

    await createSession(req, user._id);

    res.status(201).json({message:"Signup successful",user:publicUser(user)});}
    catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({message:"An account with this email already exists"});
    }
    console.error("Signup failed:", err);
    return res.status(500).json({ message: "Unable to create your account right now" });
  }
}

exports.postloginpage=async (req,res,next)=>{
    try{
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
        return res.status(400).json({message:"Enter your email and password"});
    }

    const user=await User.findOne({email});

    if(!user){
        return res.status(401).json({message:"Email or password is incorrect"});
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({message:"Email or password is incorrect"})
    }

    await createSession(req, user._id);

    res.json({
  message: "Login successful",
  user: publicUser(user)
});}
    catch (err) {
console.error("Login failed:", err);
return res.status(500).json({ message: "Unable to sign in right now" });
  }
}

exports.postlogout=(req,res,next)=>{
    req.session.destroy((error) => {
        if (error) return res.status(500).json({message:"Unable to end the session"});
        res.clearCookie("connect.sid");
        res.json({message:"Logged out"});
    });
}

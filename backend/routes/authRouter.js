const express=require('express');
const Router=express.Router();

console.log("Auth routes loaded");
const {postSignUp}=require("../controller/authcontroller")
const {postloginpage}=require("../controller/authcontroller")
const {postlogout}=require("../controller/authcontroller")

Router.post("/signup",postSignUp)
//Router.post("/login",postloginpage)
Router.post("/login", (req,res,next)=>{
    console.log("LOGIN ROUTE HIT");
    next();
}, postloginpage);
Router.post("/logout",postlogout)

module.exports=Router;
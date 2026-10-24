const express=require('express');
const Router=express.Router();


const {postgetnewchat}=require("../controller/chatcontroller")
const {getchats}=require("../controller/chatcontroller")
const {getchatmessages}=require("../controller/chatcontroller")
const {postmessage}=require("../controller/chatcontroller")

const requireUserSession = (req, res, next) => {
    if (!req.session?.userId) {
        return res.status(401).json({message:"Please sign in to continue"});
    }
    if (req.session.userId.toString() !== req.params.userId) {
        return res.status(403).json({message:"You cannot access another user's chats"});
    }
    next();
};

Router.post('/new-chat/:userId',requireUserSession,postgetnewchat)
Router.get('/chats/:userId',requireUserSession,getchats)
Router.get('/chat/:userId/:chatId',requireUserSession,getchatmessages)
Router.post('/chat/:userId/:chatId',requireUserSession,postmessage)


module.exports=Router;
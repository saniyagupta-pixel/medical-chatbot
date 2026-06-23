const express=require('express');
const Router=express.Router();


const {postgetnewchat}=require("../controller/chatcontroller")
const {getchats}=require("../controller/chatcontroller")
const {getchatmessages}=require("../controller/chatcontroller")
const {postmessage}=require("../controller/chatcontroller")

Router.post('/new-chat/:userId',postgetnewchat)
Router.get('/chats/:userId',getchats)
Router.get('/chat/:userId/:chatId',getchatmessages)
Router.post('/chat/:userId/:chatId',postmessage)


module.exports=Router;
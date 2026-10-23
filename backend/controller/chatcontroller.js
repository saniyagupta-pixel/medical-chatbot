// const express=require('express');
const Chat=require("../model/chat");
const axios=require("axios")

const chatbotApiUrl =
    process.env.CHATBOT_API_URL ||
    (process.env.NODE_ENV === "production"
        ? ""
        : "http://127.0.0.1:8080/chat");


exports.postgetnewchat=async(req,res,next)=>{
    try{const userId=req.params.userId;
    
    const chat=await Chat.create({
        userId:userId,
        title:"new chat",
        messages:[]
    })
    res.json(chat);
    //sends javascript object-json to frontend
}
catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
//side bar chat titles 
exports.getchats=async (req,res,next)=>{
    try{const userId=req.params.userId;

    const Chats=await Chat.find(
        {userId:userId},
        {messages:0}
    )
    res.json(Chats);}
    catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

exports.getchatmessages=async(req,res,next)=>{
    try{const chatId=req.params.chatId;
    const userId=req.params.userId;

    const chat=await Chat.findOne({
        _id:chatId,
        userId:userId
    })
    res.json(chat);}
    catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


exports.postmessage=async(req,res,next)=>{
    try{const userId=req.params.userId;
    const chatId=req.params.chatId;

    if (!chatbotApiUrl) {
        return res.status(503).json({message:"Chatbot service URL is not configured"});
    }

    const chat=await Chat.findOne({
        userId:userId,
        _id:chatId
    })

    if(!chat) return res.status(404).json({message:"chat not found"});

    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) {
        return res.status(400).json({message:"Enter a message before sending"});
    }

    const history = chat.messages.map(({role, content}) => ({role, content}));

    const response=await axios.post(
        chatbotApiUrl,
        {
            message,
            chathistory:history
        },
        {timeout:120000}
    )
    const botreply=typeof response.data?.reply === "string" ? response.data.reply.trim() : "";
    if (!botreply) {
        return res.status(502).json({message:"The chatbot service returned an empty response"});
    }

    if(chat.messages.length===0){
        chat.title=message.slice(0,30);
    }

    chat.messages.push({role:"user",content:message});

    chat.messages.push({
        role:"bot",
        content:botreply
    })

    await chat.save();

    res.json({reply:botreply});}
    catch (err) {
    console.error("Chat request failed:", err.response?.data || err.message);

    return res.status(502).json({
        message: err.response?.data?.message || "The chatbot service could not answer right now"
    });
}
}
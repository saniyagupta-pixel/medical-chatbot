const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    role:String,
    content:String
})
const chatSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:String,
    messages:[messageSchema]
})

module.exports=mongoose.model('Chat',chatSchema)
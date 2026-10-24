const express=require("express")
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const session=require('express-session')
const { default: MongoStore } = require("connect-mongo");
const cors = require("cors");

dotenv.config();

const app=express();
const frontendOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "https://medical-frontend-hz37.onrender.com"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
  origin: ["http://localhost:5173", ...frontendOrigins],
  credentials: true
}));
app.use(express.json());


const authRoutes=require("./routes/authRouter")
const chatRoutes=require("./routes/chatRouter")


app.use(
    session({
        secret:process.env.SESSION_KEY,
        resave:false,
        saveUninitialized:false,
        store:MongoStore.create({
            mongoUrl:process.env.MONGO_URL
        }),
        cookie:{
            maxAge:1000 * 60 * 60 * 24 * 365 * 10
        }
    })
)

app.use("/api/auth",authRoutes)
app.use("/api",chatRoutes)


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("mongoDB connected")
}).catch((error)=>console.log(error))


const auth=(req,res,next)=>{
    if(!req.session.userId){
        return res.status(401).json({message:"unauthorized"})
    }

    next();
    
}

const port = process.env.PORT || 3002;
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})

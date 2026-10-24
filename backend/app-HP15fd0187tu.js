const express=require("express")
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const session=require('express-session')
const { default: MongoStore } = require("connect-mongo");
const cors = require("cors");

dotenv.config();

const app=express();
app.set("trust proxy", 1);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://medical-frontend-hz37.onrender.com",
  "https://medical-chatbot-rho.vercel.app",
  "https://medical-chatbot-e65v.vercel.app",
  "https://medical-chatbot-e65v-git-fix-chatbot-service-url-sg-web-elite.vercel.app",
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "").split(",")
].filter(Boolean).map((origin) => origin.trim().replace(/\/+$/, "")));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked request from origin: ${origin}`);
    return callback(null, false);
  },
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
            maxAge:1000 * 60 * 60 * 24 * 30,
            httpOnly:true,
            sameSite:process.env.NODE_ENV === "production" ? "none" : "lax",
            secure:process.env.NODE_ENV === "production"
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

app.listen(3002,()=>{
    console.log("server running on port 3002");
})

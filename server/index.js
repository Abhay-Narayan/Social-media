import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import {fileURLToPath} from "url";
import mongoose from "mongoose";
import {register} from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Configuration

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors()); 
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

// setting up file storage cnfig

const storage=multer.diskStorage({
    destination: function(req, file , cb){
        cb(null, "public/assets");
    },
    filename: function(req, file , cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage});
// ROUTES WITH FILES

app.post("/auth/register", upload.single("picture"), register)

// ROUTES

app.use("/auth",authRoutes);
app.use("/users", userRoutes);

// MONGOOSE setup

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`server port: ${PORT}`));
}).catch((error)=>console.log(`${error} did not connect`));

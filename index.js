import express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.route.js'
import cors from 'cors'
dotenv.config()
const app = express()
const port = process.env.PORT || 4000



app.use(express.json());
app.use(cookieParser())
app.use(cors())


// router
app.use('/api/v1', authRouter)





const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        app.listen(port, () => {
            console.log(`app running on port ${port}...`);
            console.log('connected to mongoose');
        })
    } catch (error) {
       console.log(error); 
    }
}
startServer()


// error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
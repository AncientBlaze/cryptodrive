import express from "express";
import mongoose from "mongoose";
import CoinRouter from './src/Routes/CoinRoute.js'
import UserRouter from './src/Routes/UserRoute.js'
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/coins', CoinRouter);
app.use('/user', UserRouter);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('DB Connected')
    app.listen(process.env.port, () => {
        console.log(`Server running on port ${MONGO_URL}:${process.env.port}`)
    })
}).catch((err) => {
    console.log(err)
})
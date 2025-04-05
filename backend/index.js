import express from "express";
import mongoose from "mongoose";
import CoinRouter from './src/Routes/CoinRoute.js';
import UserRouter from './src/Routes/UserRoute.js';
import TransactionRouter from './src/Routes/Transaction.route.js';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use('/coins', CoinRouter);
app.use('/transactions', TransactionRouter);
app.use('/user', UserRouter);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('DB Connected');
    app.listen(process.env.port, () => {
        console.log(`Server is running on port ${process.env.port}`);
    });
}).catch((error) => {
    console.error("Error connecting to database:", error);
});


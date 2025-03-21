import express from "express";
import mongoose from "mongoose";
import CoinRouter from './src/Routes/CoinRoute.js';
import UserRouter from './src/Routes/UserRoute.js';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/coins', CoinRouter);
app.use('/user', UserRouter);
app.use("/", (req, res) => {
    res.status(200).send("Hello World!");
    res.end();
});

mongoose.connect(process.env.localhosturl).then(() => {
    console.log('DB Connected');
    app.listen(process.env.port, () => {
        console.log(`Server is running on port ${process.env.port}`);
    });
}).catch((error) => {
    console.error("Error connecting to database:", error);
});

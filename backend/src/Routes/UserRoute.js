import express from "express";


import {
    insertUser,
    updateCoin,
    getUser,
    getUserByName,
    login,
    registration,
    updateAuthentication
} from '../controllers/UserControllers.js';

const route = express.Router();

route.post('/insert', insertUser);
route.put('/updateCoin', updateCoin);
route.get('/get', getUser);
route.post('/getByName', getUserByName);
route.post('/login', login);
route.put('/updateAuthentication', updateAuthentication);
route.post("/register", registration)

export default route;
